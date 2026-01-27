import { useState, useCallback } from 'react';
import { Product } from '../types';
import { searchProducts } from '../lib/scraper';

export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, location?: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchProducts(query, location);
      setProducts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, search };
}
