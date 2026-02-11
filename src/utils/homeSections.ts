import { Product, Store } from '../types';

// Popular device categories
const POPULAR_DEVICES = [
  'Laptop',
  'Smartphone',
  'Tablet',
  'Smart TV',
  'Gaming Console',
  'Headphones',
  'Smartwatch',
  'Camera',
];

// Mock stores
const MOCK_STORES: Store[] = [
  {
    id: 'store1',
    name: 'TechStore',
    rating: 4.5,
    deliverySpeed: '1-2 days',
    serviceQuality: 4.5,
    city: 'Nicosia',
    coversIsland: true,
  },
  {
    id: 'store2',
    name: 'ElectroWorld',
    rating: 4.3,
    deliverySpeed: '2-3 days',
    serviceQuality: 4.2,
    city: 'Limassol',
    coversIsland: false,
  },
  {
    id: 'store3',
    name: 'DigitalHub',
    rating: 4.7,
    deliverySpeed: '1 day',
    serviceQuality: 4.6,
    city: 'Paphos',
    coversIsland: true,
  },
];

/**
 * Generate mock products for a query
 */
function generateMockProducts(query: string): Product[] {
  const mockProducts: Product[] = [];

  MOCK_STORES.forEach((store) => {
    for (let i = 0; i < 3; i++) {
      mockProducts.push({
        id: `${store.id}-${query.toLowerCase().replace(/\s+/g, '-')}-${i}`,
        name: `${query} - ${store.name} Option ${i + 1}`,
        price: Math.random() * 200 + 50,
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

  return mockProducts.sort((a, b) => a.price - b.price);
}

/**
 * Generate products for "Most Searched Devices" section
 */
export function getMostSearchedDevices(): Product[] {
  const allProducts: Product[] = [];
  
  POPULAR_DEVICES.forEach((device) => {
    const products = generateMockProducts(device);
    // Take first product from each category
    if (products.length > 0) {
      allProducts.push(products[0]);
    }
  });

  // Sort by popularity (simulated - random for now)
  return allProducts.sort(() => Math.random() - 0.5).slice(0, 8);
}

/**
 * Generate products for "Best Rated" section
 */
export function getBestRatedProducts(): Product[] {
  const allProducts: Product[] = [];
  
  // Generate products from various categories
  ['Laptop', 'Smartphone', 'Headphones', 'Smart TV', 'Tablet'].forEach((category) => {
    const products = generateMockProducts(category);
    allProducts.push(...products);
  });

  // Filter products with ratings and sort by rating
  return allProducts
    .filter((p) => p.rating && p.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);
}

/**
 * Generate products for "Latest Deals" section (lowest prices)
 */
export function getLatestDeals(): Product[] {
  const allProducts: Product[] = [];
  
  // Generate products from various categories
  ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Smart TV', 'Camera'].forEach((category) => {
    const products = generateMockProducts(category);
    allProducts.push(...products);
  });

  // Sort by price (lowest first)
  return allProducts.sort((a, b) => a.price - b.price).slice(0, 10);
}

/**
 * Generate products for "Fastest Delivery" section
 */
export function getFastestDeliveryProducts(): Product[] {
  const allProducts: Product[] = [];
  
  // Generate products from various categories
  ['Laptop', 'Smartphone', 'Tablet', 'Headphones'].forEach((category) => {
    const products = generateMockProducts(category);
    allProducts.push(...products);
  });

  // Sort by delivery speed (products with "1-2 days" first)
  return allProducts
    .sort((a, b) => {
      const aSpeed = parseDeliverySpeed(a.deliveryTime || a.store.deliverySpeed || '');
      const bSpeed = parseDeliverySpeed(b.deliveryTime || b.store.deliverySpeed || '');
      return aSpeed - bSpeed;
    })
    .slice(0, 10);
}

/**
 * Generate products for category sections
 */
export function getCategoryProducts(category: string): Product[] {
  const products = generateMockProducts(category);
  return products.slice(0, 8);
}

/**
 * Parse delivery speed to number for sorting
 */
function parseDeliverySpeed(speed: string): number {
  const match = speed.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}
