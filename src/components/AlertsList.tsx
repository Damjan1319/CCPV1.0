import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { alertsAPI } from '../lib/api';

interface Alert {
  id: number;
  product_name: string;
  product_url: string;
  product_image_url?: string;
  current_price: number;
  target_price: number;
  currency: string;
  store_name?: string;
  status: string;
  created_at: string;
  notified_at?: string;
}

export function AlertsList() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await alertsAPI.getAll();
      setAlerts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleDelete = async (alertId: number) => {
    try {
      await alertsAPI.delete(alertId);
      setAlerts(alerts.filter((a) => a.id !== alertId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alert');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">{t('alerts.noAlerts')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-4">
            {alert.product_image_url && (
              <img
                src={alert.product_image_url}
                alt={alert.product_name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {alert.product_name}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('alerts.currentPrice')}:{' '}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {alert.current_price.toFixed(2)} {alert.currency}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('alerts.targetPrice')}:{' '}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {alert.target_price.toFixed(2)} {alert.currency}
                    </span>
                  </span>
                </div>
                {alert.store_name && (
                  <div className="text-gray-600 dark:text-gray-400">
                    {t('filter.store')}: {alert.store_name}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('alerts.status')}:{' '}
                    <span
                      className={`font-medium ${
                        alert.status === 'triggered'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {t(`alerts.${alert.status}`)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={alert.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 text-sm text-center"
              >
                {t('product.visitStore')}
              </a>
              <button
                onClick={() => handleDelete(alert.id)}
                className="px-3 py-1.5 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
              >
                {t('alerts.delete')}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
