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

  // Generate image URL based on product name
  const getImageUrl = () => {
    if (product.imageUrl) return product.imageUrl;
    
    // Generate image based on product name
    const name = product.name.toLowerCase();
    const imageMap: { [key: string]: string } = {
      laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80',
      smartphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
      tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
      'smart tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
      tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
      'gaming console': 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
      console: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
      headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      smartwatch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
    };
    
    for (const [key, url] of Object.entries(imageMap)) {
      if (name.includes(key)) return url;
    }
    
    // Default electronics image
    return 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80';
  };

  // Check if product is on sale and calculate discount
  const isOnSale = Math.random() > 0.6; // 40% chance of being on sale
  const originalPrice = isOnSale ? product.price * (1 + Math.random() * 0.4 + 0.1) : product.price;
  const discountPercent = isOnSale ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : 0;
  const storesCount = Math.floor(Math.random() * 5) + 5; // 5-9 stores

  return (
    <div className="bg-gray-50 dark:bg-[#1c1c1e] rounded-xl flex flex-col h-full overflow-hidden">
      {/* Image with discount badge and heart icon */}
      <div className="w-full h-40 bg-gray-50 dark:bg-[#1c1c1e] overflow-hidden relative flex items-center justify-center">
        <img
          src={getImageUrl()}
          alt={product.name}
          className="w-full h-full object-contain rounded-xl p-2"
          style={{ mixBlendMode: 'multiply' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80';
          }}
        />
        {isOnSale && discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-pink-500 text-white px-2.5 py-1 rounded-full font-bold text-xs shadow-md">
            -{discountPercent}%
          </div>
        )}
        {/* Heart icon for favorites */}
        <button
          className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-[#1c1c1e]/90 rounded-full hover:bg-white dark:hover:bg-[#1c1c1e] transition-colors shadow-sm"
          aria-label="Add to favorites"
        >
          <svg
            className="w-4 h-4 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 min-h-[280px]">
        {/* Product name and rating */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-white mb-1.5 line-clamp-2 leading-tight min-h-[2.5rem] font-apple tracking-[-0.01em]">
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 min-h-[1.25rem]">
              <span className="text-amber-500 text-sm">★</span>
              <span className="text-xs text-[#86868b] dark:text-[#ebebf5] font-medium font-apple">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Prices */}
        <div className="mb-3 min-h-[3.5rem]">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-semibold text-[#1d1d1f] dark:text-white font-apple tracking-[-0.01em]">
              {product.currency} {product.price.toFixed(2)}
            </span>
            {isOnSale && originalPrice > product.price && (
              <span className="text-sm text-[#86868b] dark:text-[#ebebf5]/60 line-through font-apple">
                {product.currency} {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {isOnSale && (
            <p className="text-xs text-[#86868b] dark:text-[#ebebf5]/60 font-apple">
              Or 3 payments of {product.currency} {(product.price / 3).toFixed(2)}*
            </p>
          )}
        </div>

        {/* Store links and Actions */}
        <div className="mt-auto space-y-1">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-3 py-2 bg-gray-100 dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#ebebf5] rounded-lg hover:bg-gray-200 dark:hover:bg-[#38383a] transition-colors text-xs font-medium text-center font-apple"
          >
            {t('product.visitStore', { defaultValue: 'Visit Store' })} - {product.store.name}
          </a>
          
          {/* Actions - Compare and Alert buttons */}
          <div className="flex gap-2">
          {onCompare && (
            <button
              onClick={() => onCompare(product)}
              disabled={isInCompare}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isInCompare
                  ? 'bg-gray-200 dark:bg-[#2c2c2e] text-[#86868b] dark:text-[#ebebf5]/60 cursor-not-allowed font-apple'
                  : 'bg-gray-100 dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#ebebf5] hover:bg-gray-200 dark:hover:bg-[#38383a] font-apple'
              }`}
            >
              <span className="font-apple">{isInCompare ? t('compare.added') : t('compare.add')}</span>
            </button>
          )}
            {onSetAlert && isAuthenticated && (
              <button
                onClick={() => onSetAlert(product)}
                className="px-3 py-2 bg-gray-100 dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#ebebf5] rounded-lg hover:bg-gray-200 dark:hover:bg-[#38383a] transition-colors flex items-center justify-center font-apple"
                title={t('alerts.setAlert')}
              >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
