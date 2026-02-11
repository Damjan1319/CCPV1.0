import { useTranslation } from 'react-i18next';
import { Product } from '../types';

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'delivery';

interface FilterBarProps {
  onSort: (option: SortOption) => void;
  currentSort: SortOption;
}

export function FilterBar({ onSort, currentSort }: FilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <label className="text-sm font-medium text-[#1d1d1f] dark:text-[#ebebf5] whitespace-nowrap font-apple">
        {t('filter.sortBy')}:
      </label>
      <select
        value={currentSort}
        onChange={(e) => onSort(e.target.value as SortOption)}
        className="px-4 py-2 border border-gray-300 dark:border-[#38383a] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white text-sm font-apple"
      >
        <option value="price-asc">{t('filter.priceLow')}</option>
        <option value="price-desc">{t('filter.priceHigh')}</option>
        <option value="rating">{t('filter.rating')}</option>
        <option value="delivery">{t('filter.deliverySpeed')}</option>
      </select>
    </div>
  );
}

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products];

  switch (sortOption) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'delivery':
      // Sort by delivery speed (lower numbers first)
      return sorted.sort((a, b) => {
        const aSpeed = parseDeliverySpeed(a.deliveryTime || a.store.deliverySpeed || '');
        const bSpeed = parseDeliverySpeed(b.deliveryTime || b.store.deliverySpeed || '');
        return aSpeed - bSpeed;
      });
    default:
      return sorted;
  }
}

function parseDeliverySpeed(speed: string): number {
  const match = speed.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}
