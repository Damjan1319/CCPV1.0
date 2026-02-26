import axios from 'axios';
import * as cheerio from 'cheerio';
import { STORE_CONFIGS } from './store-configs.js';

// ─── Puppeteer (optional) ────────────────────────────────────────────────────
// Install with:  cd server && npm install puppeteer

let _puppeteer = null;
let _browser = null;

async function getPuppeteer() {
  if (_puppeteer) return _puppeteer;
  try {
    _puppeteer = await import('puppeteer');
    return _puppeteer;
  } catch {
    console.warn('[scraper] Puppeteer not installed — JS-rendered stores will be skipped.');
    console.warn('[scraper] Run:  cd server && npm install puppeteer');
    return null;
  }
}

async function getBrowser() {
  const pup = await getPuppeteer();
  if (!pup) return null;

  if (!_browser || !_browser.connected) {
    _browser = await pup.default.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
      ],
    });
    console.log('[scraper] Puppeteer browser launched.');
  }
  return _browser;
}

// Gracefully close browser on process exit
process.on('exit', () => { if (_browser) _browser.close(); });
process.on('SIGTERM', () => { if (_browser) _browser.close(); });

// ─── Price parser (handles EU format: 1.299,99 and US: 1,299.99) ─────────────

function parsePrice(priceText) {
  if (!priceText) return 0;

  // Strip currency symbols, whitespace, and HTML entities
  let s = priceText.replace(/[€$£\u00a0\s]/g, '').trim();

  // Remove any trailing/leading non-numeric chars
  s = s.replace(/^[^\d]+|[^\d]+$/g, '');

  if (!s) return 0;

  const hasComma = s.includes(',');
  const hasDot   = s.includes('.');

  if (hasComma && hasDot) {
    // Determine which is the decimal separator by position
    const lastComma = s.lastIndexOf(',');
    const lastDot   = s.lastIndexOf('.');
    if (lastComma > lastDot) {
      // European: 1.299,99
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // US: 1,299.99
      s = s.replace(/,/g, '');
    }
  } else if (hasComma) {
    // Ambiguous comma — treat as decimal if 1–2 digits follow
    const after = s.split(',')[1] || '';
    s = after.length <= 2 ? s.replace(',', '.') : s.replace(/,/g, '');
  }
  // hasDot only → standard float, no change needed

  const price = parseFloat(s);
  return isNaN(price) ? 0 : price;
}

// ─── Relevance filter ─────────────────────────────────────────────────────────
// Keep products whose name contains at least one meaningful word from the query.
// Prevents category-page scraping from returning unrelated accessories.

function isRelevant(productName, query) {
  const stopWords = new Set(['and', 'or', 'the', 'with', 'for', 'a', 'an', 'in', 'of', 'to']);
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 1 && !stopWords.has(w));
  if (words.length === 0) return true; // can't filter, allow all
  const name = productName.toLowerCase();
  return words.some((w) => name.includes(w));
}

// ─── Rating parser ────────────────────────────────────────────────────────────

function parseRating(ratingText) {
  if (!ratingText) return undefined;
  const match = ratingText.match(/(\d+\.?\d*)/);
  if (!match) return undefined;
  const r = parseFloat(match[1]);
  return r > 5 ? r / 2 : r;  // normalise out-of-10 to out-of-5
}

// ─── Build store info object ──────────────────────────────────────────────────

function buildStoreInfo(config) {
  return {
    id: config.id,
    name: config.name,
    rating: config.rating,
    deliverySpeed: config.deliverySpeed,
    serviceQuality: config.serviceQuality,
    city: config.city,
    location: config.location,
    coversIsland: config.coversIsland ?? false,
  };
}

// ─── CSS-selector extraction (Cheerio) ───────────────────────────────────────

function extractProductsByCss($, config) {
  const products = [];

  $(config.selectors.productContainer).each((index, element) => {
    try {
      if (products.length >= config.maxResults) return false;

      const name      = $(element).find(config.selectors.productName).first().text().trim();
      const priceText = $(element).find(config.selectors.productPrice).first().text().trim();
      const price     = parsePrice(priceText);
      const link      = $(element).find(config.selectors.productLink).first().attr('href') || '';
      const imgEl     = config.selectors.productImage
        ? $(element).find(config.selectors.productImage).first()
        : null;
      const imageUrl  = imgEl
        ? (imgEl.attr('src') || imgEl.attr('data-src') || imgEl.attr('data-lazy')
           || imgEl.attr('data-original') || imgEl.attr('data-lazy-src') || '')
        : '';
      const rating    = parseRating(
        config.selectors.productRating
          ? $(element).find(config.selectors.productRating).first().text().trim()
          : ''
      );

      if (!name || price <= 0) return;

      const resolveUrl = (u) => {
        if (!u) return '';
        if (u.startsWith('http')) return u;
        if (u.startsWith('//')) return `https:${u}`;
        return `${config.baseUrl}${u.startsWith('/') ? '' : '/'}${u}`;
      };

      products.push({
        id: `${config.id}-${index}`,
        name,
        price,
        currency: config.currency || 'EUR',
        store: buildStoreInfo(config),
        url: resolveUrl(link),
        imageUrl: resolveUrl(imageUrl),
        rating,
        deliveryTime: config.deliverySpeed,
        inStock: true,
      });
    } catch (err) {
      console.error(`[${config.name}] Error parsing product at index ${index}:`, err.message);
    }
  });

  return products;
}

// ─── JSON-LD extraction (schema.org) ─────────────────────────────────────────

function extractProductsFromJsonLD($, config) {
  const products = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    if (products.length >= config.maxResults) return false;
    let data;
    try { data = JSON.parse($(el).html()); } catch { return; }

    const processItem = (item, index) => {
      if (products.length >= config.maxResults) return;
      const node = item?.item || item;
      if (!node || node['@type'] !== 'Product') return;

      const name   = node.name;
      const offers = Array.isArray(node.offers) ? node.offers[0] : node.offers;
      const price  = parseFloat(offers?.price) || 0;
      if (!name || price <= 0) return;

      const rawUrl   = node.url || offers?.url || '';
      const rawImage = typeof node.image === 'string' ? node.image
                     : Array.isArray(node.image) ? node.image[0] : '';

      const resolveUrl = (u) => {
        if (!u) return '';
        if (u.startsWith('http')) return u;
        if (u.startsWith('//')) return `https:${u}`;
        return `${config.baseUrl}${u.startsWith('/') ? '' : '/'}${u}`;
      };

      products.push({
        id: `${config.id}-jsonld-${index}`,
        name,
        price,
        currency: offers?.priceCurrency || config.currency || 'EUR',
        store: buildStoreInfo(config),
        url: resolveUrl(rawUrl),
        imageUrl: resolveUrl(rawImage),
        rating: undefined,
        deliveryTime: config.deliverySpeed,
        inStock: offers?.availability !== 'https://schema.org/OutOfStock',
      });
    };

    const processList = (list) => {
      if (list?.itemListElement) {
        list.itemListElement.forEach((item, i) => processItem(item, i));
      }
    };

    if (Array.isArray(data)) {
      data.forEach((d) => {
        if (d['@type'] === 'ItemList') processList(d);
        else if (d['@type'] === 'Product') processItem(d, products.length);
      });
    } else if (data['@type'] === 'ItemList') {
      processList(data);
    } else if (data['@type'] === 'Product') {
      processItem(data, products.length);
    }
  });

  return products;
}

// ─── Cheerio scraper ──────────────────────────────────────────────────────────

async function scrapeWithCheerio(query, config) {
  let searchUrl = `${config.baseUrl}${config.searchPath.replace('{query}', encodeURIComponent(query))}`;

  // Use category fallback if available (same logic as Puppeteer scraper)
  if (config.categoryFallbacks) {
    const lq = query.toLowerCase();
    const fallbackKey = Object.keys(config.categoryFallbacks).find((k) => lq.includes(k));
    if (fallbackKey) {
      searchUrl = `${config.baseUrl}${config.categoryFallbacks[fallbackKey]}`;
      console.log(`[scraper] Cheerio  → ${config.name}: using category fallback for "${query}"`);
    }
  }

  console.log(`[scraper] Cheerio  → ${config.name}: ${searchUrl}`);

  const response = await axios.get(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 15000,
  });

  const $ = cheerio.load(response.data);

  // If method is 'jsonld', try JSON-LD first then fall back to CSS
  if (config.method === 'jsonld') {
    const jsonldProducts = extractProductsFromJsonLD($, config);
    if (jsonldProducts.length > 0) {
      console.log(`[scraper] ${config.name}: ${jsonldProducts.length} products via JSON-LD`);
      return jsonldProducts;
    }
    console.log(`[scraper] ${config.name}: no JSON-LD products, trying CSS selectors`);
  }

  const products = extractProductsByCss($, config);
  console.log(`[scraper] ${config.name}: ${products.length} products via CSS selectors`);
  return products;
}

// ─── Puppeteer scraper ────────────────────────────────────────────────────────

async function scrapeWithPuppeteer(query, config) {
  const browser = await getBrowser();
  if (!browser) return [];

  const page = await browser.newPage();

  try {
    // Hide headless Chrome fingerprint to avoid bot detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

    // Stephanis: try search URL, fall back to category page
    let searchUrl = `${config.baseUrl}${config.searchPath.replace('{query}', encodeURIComponent(query))}`;
    let usedFallback = false;

    if (config.categoryFallbacks) {
      const lq = query.toLowerCase();
      const fallbackKey = Object.keys(config.categoryFallbacks).find((k) => lq.includes(k));
      if (fallbackKey) {
        searchUrl = `${config.baseUrl}${config.categoryFallbacks[fallbackKey]}`;
        usedFallback = true;
        console.log(`[scraper] Puppeteer → ${config.name}: using category fallback for "${query}"`);
      }
    }

    console.log(`[scraper] Puppeteer → ${config.name}: ${searchUrl}`);

    const response = await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // If search URL 404'd and we haven't used a fallback, try a category fallback
    if (response?.status() === 404 && config.categoryFallbacks && !usedFallback) {
      const lq = query.toLowerCase();
      const fallbackKey = Object.keys(config.categoryFallbacks).find((k) => lq.includes(k));
      if (fallbackKey) {
        const fallbackUrl = `${config.baseUrl}${config.categoryFallbacks[fallbackKey]}`;
        console.log(`[scraper] ${config.name}: search 404 → trying category: ${fallbackUrl}`);
        await page.goto(fallbackUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      } else {
        console.log(`[scraper] ${config.name}: search 404 and no category fallback for "${query}"`);
        return [];
      }
    }

    // Wait for product container (if specified)
    if (config.waitForSelector) {
      try {
        await page.waitForSelector(config.waitForSelector, { timeout: 10000 });
      } catch {
        console.log(`[scraper] ${config.name}: selector "${config.waitForSelector}" not found`);
      }
    } else {
      // Wait a bit for content to settle
      await new Promise((r) => setTimeout(r, 2000));
    }

    const html = await page.content();
    const $    = cheerio.load(html);

    // Try JSON-LD first (works for some sites even with JS rendering)
    const jsonldProducts = extractProductsFromJsonLD($, config);
    if (jsonldProducts.length > 0) {
      console.log(`[scraper] ${config.name}: ${jsonldProducts.length} products via JSON-LD (Puppeteer)`);
      return jsonldProducts;
    }

    const products = extractProductsByCss($, config);
    console.log(`[scraper] ${config.name}: ${products.length} products via CSS selectors (Puppeteer)`);
    return products;
  } catch (err) {
    console.error(`[scraper] Puppeteer error for ${config.name}:`, err.message);
    return [];
  } finally {
    await page.close();
  }
}

// ─── Main store scraper (dispatches to right method) ─────────────────────────

async function scrapeStore(query, config) {
  try {
    if (config.method === 'puppeteer') {
      return await scrapeWithPuppeteer(query, config);
    }
    // 'cheerio' and 'jsonld' both go through the Cheerio path
    return await scrapeWithCheerio(query, config);
  } catch (err) {
    console.error(`[scraper] Failed to scrape ${config.name}:`, err.message);
    return [];
  }
}

// ─── Location filter ──────────────────────────────────────────────────────────

function filterByLocation(products, location) {
  if (!location || location === 'all') return products;
  return products.filter((p) => {
    if (p.store.coversIsland) return true;
    return (
      p.store.city === location ||
      p.store.location?.toLowerCase() === location.toLowerCase()
    );
  });
}

// ─── Mock data (fallback for dev / when scraping fails) ───────────────────────

function generateMockProducts(query, location = null) {
  const STORES = [
    { id: 'electroline',  name: 'Electroline',  rating: 4.4, deliverySpeed: '2-3 days', serviceQuality: 4.2, city: 'nicosia',  location: 'Island-wide', coversIsland: true  },
    { id: 'bionic',       name: 'Bionic',        rating: 4.5, deliverySpeed: '1-3 days', serviceQuality: 4.3, city: 'nicosia',  location: 'Island-wide', coversIsland: true  },
    { id: 'public-cy',    name: 'Public',        rating: 4.6, deliverySpeed: '1-2 days', serviceQuality: 4.5, city: 'nicosia',  location: 'Island-wide', coversIsland: true  },
    { id: 'stephanis',    name: 'Stephanis',     rating: 4.4, deliverySpeed: '2-4 days', serviceQuality: 4.3, city: 'nicosia',  location: 'Island-wide', coversIsland: true  },
    { id: 'superhome',    name: 'Superhome',     rating: 4.1, deliverySpeed: '3-5 days', serviceQuality: 3.9, city: 'nicosia',  location: 'Island-wide', coversIsland: true  },
  ];

  const allProducts = [];
  STORES.forEach((store) => {
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      const base = Math.random() * 200 + 20;
      allProducts.push({
        id: `${store.id}-${query.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        name: `${query} — ${store.name} model ${i + 1}`,
        price: Math.max(10, base + (Math.random() - 0.5) * 30),
        currency: 'EUR',
        store,
        url: `https://example.com/product/${store.id}-${i}`,
        imageUrl: undefined,
        rating: store.rating + (Math.random() - 0.5) * 0.5,
        deliveryTime: store.deliverySpeed,
        inStock: Math.random() > 0.2,
      });
    }
  });

  return filterByLocation(allProducts, location).sort((a, b) => a.price - b.price);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function searchProducts(query, location = null) {
  const hasRealStores =
    STORE_CONFIGS.length > 0 &&
    !STORE_CONFIGS.every((c) => c.baseUrl.includes('example'));

  if (!hasRealStores) {
    console.log('[scraper] No real stores configured — using mock data');
    return generateMockProducts(query, location);
  }

  // Scrape all stores in parallel (with a small delay between batches to be polite)
  const results = await Promise.allSettled(
    STORE_CONFIGS.map((config) => scrapeStore(query, config))
  );

  const allProducts = [];
  results.forEach((r) => {
    if (r.status === 'fulfilled') allProducts.push(...r.value);
    else console.error('[scraper] Store scraping rejected:', r.reason?.message);
  });

  if (allProducts.length === 0) {
    console.log('[scraper] No products from scraping — falling back to mock data');
    return generateMockProducts(query, location);
  }

  const relevant = allProducts.filter((p) => isRelevant(p.name, query));
  console.log(`[scraper] Relevance filter: ${allProducts.length} → ${relevant.length} products`);
  const filtered = relevant.length > 0 ? relevant : allProducts;

  return filterByLocation(filtered, location).sort((a, b) => a.price - b.price);
}
