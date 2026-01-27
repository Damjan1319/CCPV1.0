import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { alertsAPI } from '../lib/api';

interface SetAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export function SetAlertModal({ isOpen, onClose, product, onSuccess }: SetAlertModalProps) {
  const { t } = useTranslation();
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const target = parseFloat(targetPrice);
    if (isNaN(target) || target <= 0) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }

    if (target >= product.price) {
      setError('Target price must be less than current price');
      setLoading(false);
      return;
    }

    try {
      await alertsAPI.create({
        productId: product.id,
        productName: product.name,
        productUrl: product.url,
        productImageUrl: product.imageUrl,
        currentPrice: product.price,
        targetPrice: target,
        storeId: product.store.id,
        storeName: product.store.name,
        currency: product.currency,
      });

      onSuccess();
      onClose();
      setTargetPrice('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('alerts.loginRequired'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('alerts.setAlert')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.name}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {t('alerts.currentPrice')}: {product.price.toFixed(2)} {product.currency}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('alerts.targetPrice')} ({product.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max={product.price - 0.01}
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={t('alerts.targetPricePlaceholder')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('alerts.alertInfo')}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gray-900 dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? 'Creating...' : t('alerts.setAlert')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
