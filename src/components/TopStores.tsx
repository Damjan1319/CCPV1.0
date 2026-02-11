import { useTranslation } from 'react-i18next';
import { Store } from '../types';

interface TopStoresProps {
  stores: Store[];
}

export function TopStores({ stores }: TopStoresProps) {
  const { t } = useTranslation();

  // Sort stores by rating (highest first) and take top 6
  const topStores = [...stores]
    .filter(store => store.rating)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  if (topStores.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] dark:text-white mb-6 font-apple tracking-[-0.01em]">
        {t('stores.topStores', { defaultValue: 'Top Stores' })}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topStores.map((store) => (
          <div
            key={store.id}
            className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-[#38383a] text-center"
          >
            {store.logoUrl ? (
              <img
                src={store.logoUrl}
                alt={store.name}
                className="w-16 h-16 mx-auto mb-3 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                  {store.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-white mb-2 line-clamp-2 font-apple tracking-[-0.01em]">
              {store.name}
            </h3>
            {store.rating && (
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {store.rating.toFixed(1)}
                </span>
              </div>
            )}
            {store.deliverySpeed && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {store.deliverySpeed}
              </p>
            )}
            {store.location && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {store.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
