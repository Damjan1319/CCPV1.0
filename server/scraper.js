import axios from 'axios';
import * as cheerio from 'cheerio';
import { STORE_CONFIGS } from './store-configs.js';

/**
 * Scrape a single store
 */
async function scrapeStore(query, config) {
  try {
    const searchUrl = `${config.baseUrl}${config.searchPath.replace('{query}', encodeURIComponent(query))}`;
    
    console.log(`Scraping ${config.name}: ${searchUrl}`);

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(response.data);
    const products = [];

    $(config.selectors.productContainer).each((index, element) => {
      try {
        if (products.length >= config.maxResults) return false;

        const name = $(element).find(config.selectors.productName).first().text().trim();
        const priceText = $(element).find(config.selectors.productPrice).first().text().trim();
        const price = parsePrice(priceText);
        const link = $(element).find(config.selectors.productLink).first().attr('href') || '';
        const imageUrl = config.selectors.productImage
          ? $(element).find(config.selectors.productImage).first().attr('src') || ''
          : '';
        const ratingText = config.selectors.productRating
          ? $(element).find(config.selectors.productRating).first().text().trim()
          : '';
        const rating = parseRating(ratingText);

        if (name && price > 0) {
          const fullUrl = link.startsWith('http') 
            ? link 
            : (link.startsWith('/') ? `${config.baseUrl}${link}` : `${config.baseUrl}/${link}`);

          products.push({
            id: `${config.id}-${index}`,
            name,
            price,
            currency: config.currency || 'EUR',
            store: {
              id: config.id,
              name: config.name,
              rating: config.rating,
              deliverySpeed: config.deliverySpeed,
              serviceQuality: config.serviceQuality,
              city: config.city,
              location: config.location,
              coversIsland: config.coversIsland || false,
            },
            url: fullUrl,
            imageUrl: imageUrl.startsWith('http') ? imageUrl : (imageUrl.startsWith('/') ? `${config.baseUrl}${imageUrl}` : ''),
            rating,
            deliveryTime: config.deliverySpeed,
            inStock: true,
          });
        }
      } catch (error) {
        console.error(`Error parsing product in ${config.name}:`, error.message);
      }
    });

    console.log(`Found ${products.length} products from ${config.name}`);
    return products;
  } catch (error) {
    console.error(`Error scraping ${config.name}:`, error.message);
    return [];
  }
}

/**
 * Parse price from text
 */
function parsePrice(priceText) {
  // Remove currency symbols and extract number
  const cleaned = priceText.replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(',', '.');
  const price = parseFloat(normalized);
  return isNaN(price) ? 0 : price;
}

/**
 * Parse rating from text
 */
function parseRating(ratingText) {
  const match = ratingText.match(/(\d+\.?\d*)/);
  if (match) {
    const rating = parseFloat(match[1]);
    // Normalize if out of 10
    return rating > 5 ? rating / 2 : rating;
  }
  return undefined;
}

/**
 * Filter products by location
 */
function filterByLocation(products, location) {
  if (!location || location === 'all') {
    return products;
  }

  return products.filter((product) => {
    if (product.store.coversIsland) {
      return true;
    }
    return product.store.city === location || product.store.location?.toLowerCase() === location.toLowerCase();
  });
}

/**
 * Generate mock products for development/testing
 */
function generateMockProducts(query, location = null) {
  const STORES = [
    {
      id: 'store1',
      name: 'Cyprus Electronics',
      rating: 4.5,
      deliverySpeed: '2-3 days',
      serviceQuality: 4.2,
      city: 'nicosia',
      location: 'Nicosia',
      coversIsland: true,
    },
    {
      id: 'store2',
      name: 'Mediterranean Market',
      rating: 4.3,
      deliverySpeed: '1-2 days',
      serviceQuality: 4.0,
      city: 'limassol',
      location: 'Limassol',
      coversIsland: false,
    },
    {
      id: 'store3',
      name: 'Island Wide Store',
      rating: 4.7,
      deliverySpeed: '3-5 days',
      serviceQuality: 4.5,
      city: 'larnaca',
      location: 'Larnaca',
      coversIsland: true,
    },
    {
      id: 'store4',
      name: 'Paphos Premium',
      rating: 4.4,
      deliverySpeed: '2-4 days',
      serviceQuality: 4.3,
      city: 'paphos',
      location: 'Paphos',
      coversIsland: false,
    },
    {
      id: 'store5',
      name: 'Coastal Goods',
      rating: 4.6,
      deliverySpeed: '1-3 days',
      serviceQuality: 4.4,
      city: 'ayia-napa',
      location: 'Ayia Napa',
      coversIsland: false,
    },
  ];

  const allProducts = [];

  STORES.forEach((store) => {
    // Generate 2-4 products per store
    const productCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < productCount; i++) {
      const basePrice = Math.random() * 200 + 20; // Price between 20-220 EUR
      const priceVariation = (Math.random() - 0.5) * 30; // ±15 EUR variation
      
      allProducts.push({
        id: `${store.id}-${query.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        name: `${query} - ${store.name} ${i + 1}`,
        price: Math.max(10, basePrice + priceVariation),
        currency: 'EUR',
        store,
        url: `https://example.com/product/${store.id}-${i}`,
        imageUrl: undefined,
        rating: store.rating ? store.rating + (Math.random() - 0.5) * 0.5 : undefined,
        deliveryTime: store.deliverySpeed,
        inStock: Math.random() > 0.2,
      });
    }
  });

  // Filter by location if specified
  const filteredProducts = filterByLocation(allProducts, location);

  // Sort by price
  return filteredProducts.sort((a, b) => a.price - b.price);
}

/**
 * Search products across all configured stores
 */
export async function searchProducts(query, location = null) {
  // If no store configs or all are example stores, use mock data
  const hasRealStores = STORE_CONFIGS.length > 0 && 
    !STORE_CONFIGS.every(config => config.baseUrl.includes('example'));
  
  if (!hasRealStores) {
    console.log('No real stores configured, using mock data');
    return generateMockProducts(query, location);
  }

  const allProducts = [];

  // Scrape all stores in parallel
  const scrapingPromises = STORE_CONFIGS.map((config) => scrapeStore(query, config));
  const results = await Promise.allSettled(scrapingPromises);

  // Collect all products
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allProducts.push(...result.value);
    } else {
      console.error('Store scraping failed:', result.reason);
    }
  });

  // If no products found from scraping, fallback to mock data
  if (allProducts.length === 0) {
    console.log('No products found from scraping, using mock data');
    return generateMockProducts(query, location);
  }

  // Filter by location if specified
  const filteredProducts = filterByLocation(allProducts, location);

  // Sort by price
  return filteredProducts.sort((a, b) => a.price - b.price);
}
