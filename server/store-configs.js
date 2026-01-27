/**
 * Store configurations for Cyprus market
 * 
 * To add a new store:
 * 1. Visit the store's website
 * 2. Inspect the HTML structure (F12 in browser)
 * 3. Find the CSS selectors for:
 *    - Product container (the element that wraps each product)
 *    - Product name
 *    - Product price
 *    - Product link
 *    - Product image (optional)
 *    - Product rating (optional)
 * 4. Add configuration below
 */

export const STORE_CONFIGS = [
  // Example configuration - replace with real stores
  {
    id: 'store1',
    name: 'Cyprus Electronics',
    baseUrl: 'https://example-store.com',
    searchPath: '/search?q={query}',
    currency: 'EUR',
    rating: 4.5,
    deliverySpeed: '2-3 days',
    serviceQuality: 4.2,
    city: 'nicosia',
    location: 'Nicosia',
    coversIsland: true,
    maxResults: 10,
    selectors: {
      productContainer: '.product-item', // CSS selector for product container
      productName: '.product-title',     // CSS selector for product name
      productPrice: '.price',             // CSS selector for price
      productLink: 'a',                   // CSS selector for product link
      productImage: '.product-image img', // CSS selector for product image (optional)
      productRating: '.rating',           // CSS selector for rating (optional)
    },
  },
  
  // Add more store configurations here
  // {
  //   id: 'store2',
  //   name: 'Another Store',
  //   baseUrl: 'https://another-store.com',
  //   searchPath: '/search?query={query}',
  //   currency: 'EUR',
  //   rating: 4.3,
  //   deliverySpeed: '1-2 days',
  //   serviceQuality: 4.0,
  //   city: 'limassol',
  //   location: 'Limassol',
  //   coversIsland: false,
  //   maxResults: 10,
  //   selectors: {
  //     productContainer: '.product',
  //     productName: 'h2',
  //     productPrice: '.price-tag',
  //     productLink: 'a.product-link',
  //     productImage: 'img',
  //   },
  // },
];
