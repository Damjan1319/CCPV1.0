/**
 * Store configurations for Cyprus market
 *
 * method: 'cheerio'   → static/server-rendered HTML (fast, lightweight)
 * method: 'puppeteer' → JS-rendered SPA (requires Puppeteer install)
 * method: 'jsonld'    → schema.org JSON-LD embedded in page (Cheerio, no JS needed)
 *
 * To add a new store:
 * 1. Visit the store's website
 * 2. Inspect the HTML structure (F12 in browser)
 * 3. Find CSS selectors for product container, name, price, link, image
 * 4. Add config below
 */

export const STORE_CONFIGS = [
  // ─────────────────────────────────────────────────────────────
  // CHEERIO-BASED (server-rendered HTML, no JS needed)
  // ─────────────────────────────────────────────────────────────

  {
    id: 'electroline',
    name: 'Electroline',
    baseUrl: 'https://electroline.cy',
    searchPath: '/?s={query}&post_type=product',
    currency: 'EUR',
    rating: 4.4,
    deliverySpeed: '2-3 days',
    serviceQuality: 4.2,
    city: 'nicosia',
    location: 'Island-wide',
    coversIsland: true,
    maxResults: 12,
    method: 'cheerio',
    selectors: {
      productContainer: '.listing-product',
      productName: '.listing-product__title',
      productPrice: '.listing-product-price',
      productLink: 'a',
      productImage: '.listing-product__image-wrapper img',
    },
  },

  {
    id: 'bionic',
    name: 'Bionic',
    baseUrl: 'https://bionic.com.cy',
    searchPath: '/en/products?search={query}',
    currency: 'EUR',
    rating: 4.5,
    deliverySpeed: '1-3 days',
    serviceQuality: 4.3,
    city: 'nicosia',
    location: 'Island-wide',
    coversIsland: true,
    maxResults: 12,
    method: 'puppeteer',
    waitForSelector: '.product-item',
    selectors: {
      productContainer: '.product-item',
      productName: '.product-name a',
      productPrice: '.display-price',
      productLink: '.product-name a',
      productImage: 'img.image-gallery-image',
    },
    categoryFallbacks: {
      laptop: '/en/products/c/notebooks',
      phone: '/en/products/c/smartphones',
      tv: '/en/products/c/televisions',
      tablet: '/en/products/c/tablets',
      headphone: '/en/products/c/headphones',
      camera: '/en/products/c/cameras',
      'washing machine': '/en/products/c/washing-machines',
      refrigerator: '/en/products/c/refrigerators',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // JSON-LD BASED (schema.org embedded data, Cheerio)
  // ─────────────────────────────────────────────────────────────

  {
    id: 'superhome',
    name: 'Superhome',
    baseUrl: 'https://superhome.com.cy',
    searchPath: '/english/search-results?q={query}',
    currency: 'EUR',
    rating: 4.1,
    deliverySpeed: '3-5 days',
    serviceQuality: 3.9,
    city: 'nicosia',
    location: 'Island-wide',
    coversIsland: true,
    maxResults: 12,
    method: 'puppeteer',
    // Swift CMS uses FinderBolt (FBR) for search — JS-rendered
    waitForSelector: 'article.product',
    selectors: {
      productContainer: 'article.product',
      productName: 'h3.productHeaderNT',
      productPrice: '.text-price',
      productLink: 'a.stretched-link',
      productImage: 'img[id^="ProductImage_"]',
    },
  },

  // ─────────────────────────────────────────────────────────────
  // PUPPETEER-BASED (JS-rendered / SPA)
  // Requires: cd server && npm install puppeteer
  // ─────────────────────────────────────────────────────────────

  {
    id: 'public-cy',
    name: 'Public',
    baseUrl: 'https://www.public.cy',
    searchPath: '/search?q={query}',
    currency: 'EUR',
    rating: 4.6,
    deliverySpeed: '1-2 days',
    serviceQuality: 4.5,
    city: 'nicosia',
    location: 'Island-wide',
    coversIsland: true,
    maxResults: 12,
    method: 'puppeteer',
    // Angular SPA + FinderBolt — verified from live page inspection
    waitForSelector: '.product-tile-container',
    selectors: {
      productContainer: '.product-tile-container',
      productName: '.product__title a',
      productPrice: '.product__price',
      productLink: '.product__gallery__image',
      productImage: 'img.fixed-dimensions',
    },
    categoryFallbacks: {
      laptop: '/cat/computers-and-software/laptops',
      phone: '/cat/mobile-phones/mobile-phones',
      tv: '/cat/tv-and-cinema/televisions',
      tablet: '/cat/tablets-and-ereaders/tablets',
      headphone: '/cat/audio/headphones-and-earphones',
      camera: '/cat/cameras/digital-cameras',
      'washing machine': '/cat/large-home-appliances/washing-machines',
      refrigerator: '/cat/large-home-appliances/refrigerators',
      'air conditioner': '/cat/large-home-appliances/air-conditioners',
    },
  },

  {
    id: 'stephanis',
    name: 'Stephanis',
    baseUrl: 'https://www.stephanis.com.cy',
    // Custom STC CMS — search URL may need adjustment.
    // Falls back to laptop category page if search returns 404.
    searchPath: '/en/search?q={query}',
    currency: 'EUR',
    rating: 4.4,
    deliverySpeed: '2-4 days',
    serviceQuality: 4.3,
    city: 'nicosia',
    location: 'Island-wide',
    coversIsland: true,
    maxResults: 12,
    method: 'puppeteer',
    waitForSelector: '.prop-spotlight-details-wrapper-3',
    selectors: {
      // Verified from live page inspection (Webflow + STC CMS)
      productContainer: '.prop-spotlight-details-wrapper-3',
      productName: '.tile-product-name',
      // Regular price: .listing-details-heading inside the "large-now-price" column
      // Falls back to any .listing-details-heading if sale class absent
      productPrice: '.listing-details-column.large-now-price .listing-details-heading',
      productLink: 'a',
      productImage: 'img',
    },
    // Category page fallback: if search returns no results,
    // the scraper will try this URL instead
    categoryFallbacks: {
      laptop: '/en/products/information-technology/laptops-and-accessories/laptops/',
      phone: '/en/products/telecommunications/mobile-phones/',
      tv: '/en/products/sound-vision/televisions/',
      tablet: '/en/products/information-technology/tablets/',
      headphone: '/en/products/sound-vision/headphones/',
      camera: '/en/products/sound-vision/cameras/',
      'washing machine': '/en/products/home-appliances/washing-machines/',
      refrigerator: '/en/products/home-appliances/refrigerators/',
      'air conditioner': '/en/products/home-appliances/air-conditioning/',
    },
  },
];
