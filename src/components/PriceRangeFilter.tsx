import { useTranslation } from 'react-i18next';

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (price: number) => void;
  onMaxPriceChange: (price: number) => void;
  currentMin: number;
  currentMax: number;
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  currentMin,
  currentMax,
}: PriceRangeFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-[#1d1d1f] dark:text-[#ebebf5] whitespace-nowrap font-apple">
        {t('filter.priceRange')}:
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={minPrice}
          max={maxPrice}
          value={currentMin || ''}
          onChange={(e) => onMinPriceChange(Number(e.target.value) || minPrice)}
          placeholder={minPrice.toString()}
          className="w-20 px-2 py-1.5 border border-gray-300 dark:border-[#38383a] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white text-sm font-apple"
        />
        <span className="text-gray-500 dark:text-gray-400">-</span>
        <input
          type="number"
          min={minPrice}
          max={maxPrice}
          value={currentMax || ''}
          onChange={(e) => onMaxPriceChange(Number(e.target.value) || maxPrice)}
          placeholder={maxPrice.toString()}
          className="w-20 px-2 py-1.5 border border-gray-300 dark:border-[#38383a] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white text-sm font-apple"
        />
        <span className="text-xs text-gray-500 dark:text-gray-400">EUR</span>
      </div>
    </div>
  );
}
