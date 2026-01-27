import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useTranslation } from 'react-i18next';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  onCompare?: (product: Product) => void;
  compareProducts?: Product[];
  onSetAlert?: (product: Product) => void;
  isAuthenticated?: boolean;
}

export function ProductList({ products, loading, onCompare, compareProducts, onSetAlert, isAuthenticated }: ProductListProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-400"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-base text-gray-500 dark:text-gray-400">{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onCompare={onCompare}
          isInCompare={compareProducts?.some((p) => p.id === product.id)}
          onSetAlert={onSetAlert}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}
