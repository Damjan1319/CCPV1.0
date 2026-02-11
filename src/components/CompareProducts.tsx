import { Product } from '../types';
import { useTranslation } from 'react-i18next';

interface CompareProductsProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function CompareProducts({ products, onRemove, onClear }: CompareProductsProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1e] border-t border-gray-200 dark:border-[#38383a] shadow-lg z-50 max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('compare.title')} ({products.length}/3)
            </span>
          </div>
          <button
            onClick={onClear}
            className="text-sm text-[#86868b] dark:text-[#ebebf5]/60 hover:text-[#1d1d1f] dark:hover:text-white font-medium font-apple"
          >
            {t('compare.clearAll')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2c2c2e] rounded-lg border border-gray-200 dark:border-[#38383a]"
            >
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {product.price.toFixed(2)} {product.currency}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{product.store.name}</p>
              </div>
              <button
                onClick={() => onRemove(product.id)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-lg font-bold"
                aria-label={t('compare.remove')}
              >
                ×
              </button>
            </div>
          ))}
          {products.length < 3 && (
            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-[#2c2c2e] rounded-lg border-2 border-dashed border-gray-300 dark:border-[#38383a]">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('compare.addMore')}
              </span>
            </div>
          )}
        </div>
        {products.length >= 2 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {t('compare.feature')}
                    </th>
                    {products.map((product) => (
                      <th
                        key={product.id}
                        className="text-left py-2 px-3 font-medium text-gray-700 dark:text-gray-300"
                      >
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {t('product.price')}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="py-2 px-3">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {product.price.toFixed(2)} {product.currency}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {t('product.rating')}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="py-2 px-3">
                        {product.rating ? (
                          <span className="text-gray-900 dark:text-white">
                            {product.rating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">{t('product.noRating')}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {t('product.delivery')}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="py-2 px-3 text-gray-600 dark:text-gray-400">
                        {product.deliveryTime || product.store.deliverySpeed || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {t('filter.store')}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="py-2 px-3 text-gray-600 dark:text-gray-400">
                        {product.store.name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                      {t('product.visitStore')}
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="py-2 px-3">
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 dark:text-gray-300 hover:underline font-medium text-xs"
                        >
                          {t('product.visitStore')}
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
