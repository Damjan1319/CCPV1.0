import { useTranslation } from 'react-i18next';
import { CYPRUS_CITIES } from '../constants';

interface LocationFilterProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export function LocationFilter({ selectedLocation, onLocationChange }: LocationFilterProps) {
  const { t, i18n } = useTranslation();
  const isGreek = i18n.language === 'el';

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-[#1d1d1f] dark:text-[#ebebf5] whitespace-nowrap font-apple">
        {t('filter.location')}:
      </label>
      <select
        value={selectedLocation}
        onChange={(e) => onLocationChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-[#38383a] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white text-sm min-w-[180px] font-apple"
      >
        {CYPRUS_CITIES.map((city) => (
          <option key={city.value} value={city.value}>
            {isGreek ? city.labelEl : city.labelEn}
          </option>
        ))}
      </select>
    </div>
  );
}
