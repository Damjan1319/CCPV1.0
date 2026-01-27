export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  store: Store;
  url: string;
  imageUrl?: string;
  rating?: number;
  deliveryTime?: string;
  inStock: boolean;
}

export interface Store {
  id: string;
  name: string;
  logoUrl?: string;
  rating?: number;
  deliverySpeed?: string;
  serviceQuality?: number;
  location?: string;
  city?: string;
  coversIsland?: boolean; // If true, store delivers to entire island
}

export interface SearchResult {
  query: string;
  products: Product[];
  timestamp: number;
}

export interface ScrapingConfig {
  storeName: string;
  baseUrl: string;
  selectors: {
    productContainer: string;
    productName: string;
    productPrice: string;
    productImage?: string;
    productLink?: string;
    productRating?: string;
  };
}
