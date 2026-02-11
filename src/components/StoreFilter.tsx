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
      <label className="text-sm font-medium text-[#1d1d1f] dark:text-[#ebebf5] whitespace-nowrap font-apple">
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
                  ? 'bg-gray-900 dark:bg-[#007AFF] text-white font-apple'
                  : 'bg-gray-100 dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#ebebf5] hover:bg-gray-200 dark:hover:bg-[#38383a] font-apple'
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
