import { useTranslation } from 'react-i18next';
import { Product } from '../types';

interface StoreFilterProps {
  products: Product[];
  selectedStores: string[];
  onStoreToggle: (storeId: string) => void;
}

export function StoreFilter({ products, selectedStores, onStoreToggle }: StoreFilterProps) {
  const { t } = useTranslation();

  // Get unique stores from products
  const uniqueStores = Array.from(
    new Map(products.map((p) => [p.store.id, p.store])).values()
  );

  if (uniqueStores.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
        {t('filter.store')}:
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        {uniqueStores.map((store) => {
          const isSelected = selectedStores.length === 0 || selectedStores.includes(store.id);
          return (
            <button
              key={store.id}
              onClick={() => onStoreToggle(store.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-gray-900 dark:bg-gray-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {store.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
