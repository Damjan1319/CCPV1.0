import { useTranslation } from 'react-i18next';
import { CATEGORIES } from './CategoryNav';

const CATEGORY_COLORS: Record<string, string> = {
  laptops: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
  smartphones: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
  tvs: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
  tablets: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400',
  headphones: 'bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400',
  cameras: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
  washingMachines: 'bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400',
  refrigerators: 'bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400',
  airConditioners: 'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400',
};

interface CategoryGridProps {
  onSelect: (id: string, query: string) => void;
}

export function CategoryGrid({ onSelect }: CategoryGridProps) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-5 font-apple tracking-[-0.01em]">
        {t('categories.browse', { defaultValue: 'Browse categories' })}
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {CATEGORIES.map((cat) => {
          const colorClass = CATEGORY_COLORS[cat.id] ?? 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id, cat.query)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-100 dark:border-[#38383a] hover:border-gray-300 dark:hover:border-[#58585a] hover:shadow-md transition-all group text-center"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
                <span className="[&>svg]:w-6 [&>svg]:h-6">{cat.icon}</span>
              </div>
              <span className="text-xs font-medium text-[#1d1d1f] dark:text-white leading-tight font-apple">
                {t(cat.labelKey, { defaultValue: cat.id })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
