import { Product } from '../types';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
  isInCompare?: boolean;
  onSetAlert?: (product: Product) => void;
  isAuthenticated?: boolean;
}

export function ProductCard({ product, onCompare, isInCompare, onSetAlert, isAuthenticated }: ProductCardProps) {
  const { t } = useTranslation();

  const locationText = product.store.coversIsland
    ? t('location.islandWide')
    : product.store.city || product.store.location || '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex gap-4">
        {product.imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => {
                // Hide image if it fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {product.price.toFixed(2)} {product.currency}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t('product.delivery')}:</span>
              <span>{product.deliveryTime || product.store.deliverySpeed || 'N/A'}</span>
            </div>
            {locationText && (
              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">{t('location.availableIn')}:</span>
                <span>{locationText}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${product.inStock ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {product.inStock ? t('product.inStock') : t('product.outOfStock')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {product.store.name}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {onCompare && (
                <button
                  onClick={() => onCompare(product)}
                  disabled={isInCompare}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isInCompare
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {isInCompare ? t('compare.added') : t('compare.add')}
                </button>
              )}
              {onSetAlert && isAuthenticated && (
                <button
                  onClick={() => onSetAlert(product)}
                  className="px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-xs font-medium"
                  title={t('alerts.setAlert')}
                >
                  Alert
                </button>
              )}
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                {t('product.visitStore')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
