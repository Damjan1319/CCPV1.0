import { Product, Store, ScrapingConfig } from '../types';

// Note: Cheerio and axios scraping should be done on backend/API
// This file contains the structure for scraping, but in browser we use mock data
// For production, move scraping to a backend API endpoint

// Mock stores configuration for Cyprus market
// In production, these would be real store configurations
export const STORES: Store[] = [
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

/**
 * Generic scraper function that can be configured for different stores
 * NOTE: This should be implemented on backend/API server, not in browser
 * Example implementation structure (for backend):
 * 
 * import axios from 'axios';
 * import * as cheerio from 'cheerio';
 * 
 * export async function scrapeStore(query: string, config: ScrapingConfig): Promise<Product[]> {
 *   const response = await axios.get(`${config.baseUrl}?q=${encodeURIComponent(query)}`);
 *   const $ = cheerio.load(response.data);
 *   // ... scraping logic
 * }
 */
export async function scrapeStore(
  query: string,
  config: ScrapingConfig
): Promise<Product[]> {
  // This is a placeholder - implement on backend
  console.warn('Scraping should be done on backend API');
  return generateMockProducts(query);
}

/**
 * Parse price from text string
 */
function parsePrice(priceText: string): number {
  // Remove currency symbols and extract number
  const cleaned = priceText.replace(/[^\d.,]/g, '');
  const normalized = cleaned.replace(',', '.');
  return parseFloat(normalized) || 0;
}

/**
 * Parse rating from text string
 */
function parseRating(ratingText: string): number | undefined {
  const match = ratingText.match(/(\d+\.?\d*)/);
  if (match) {
    const rating = parseFloat(match[1]);
    return rating > 5 ? rating / 2 : rating; // Normalize if out of 10
  }
  return undefined;
}

/**
 * Search products across multiple stores
 * This function calls the backend API for scraping
 */
export async function searchProducts(query: string, location?: string): Promise<Product[]> {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  try {
    const response = await fetch(`${API_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, location }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.products) {
      return data.products;
    } else {
      throw new Error(data.error || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('API request failed, falling back to mock data:', error);
    // Fallback to mock data if API is not available
    return generateMockProducts(query);
  }
}

/**
 * Generate mock products for demonstration
 * Replace this with actual scraping in production
 */
function generateMockProducts(query: string): Product[] {
  const mockProducts: Product[] = [];
  const stores = STORES;

  stores.forEach((store, storeIndex) => {
    for (let i = 0; i < 3; i++) {
      mockProducts.push({
        id: `${store.id}-${i}`,
        name: `${query} - ${store.name} Option ${i + 1}`,
        price: Math.random() * 100 + 10,
        currency: 'EUR',
        store,
        url: `https://example.com/product/${store.id}-${i}`,
        imageUrl: undefined, // Remove placeholder images that cause errors
        rating: store.rating ? store.rating + (Math.random() - 0.5) * 0.5 : undefined,
        deliveryTime: store.deliverySpeed,
        inStock: Math.random() > 0.2,
      });
    }
  });

  return mockProducts.sort((a, b) => a.price - b.price);
}
