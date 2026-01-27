import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'register' | 'login' | 'change-password';
}

export function AuthModal({ isOpen, onClose, onSuccess, mode }: AuthModalProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authAPI.register(email);
      setSuccess(t('auth.registerSuccess'));
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.registerError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authAPI.login(email, password);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError(t('auth.passwordTooShort'));
      setLoading(false);
      return;
    }

    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setSuccess(t('auth.passwordChanged'));
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.changePasswordError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'register' && t('auth.register')}
            {mode === 'login' && t('auth.login')}
            {mode === 'change-password' && t('auth.changePassword')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-green-700 dark:text-green-400 text-sm">
            {success}
          </div>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('auth.registerInfo')}
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? t('auth.registering') : t('auth.register')}
            </button>
          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder={t('auth.passwordPlaceholder')}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? t('auth.loggingIn') : t('auth.login')}
            </button>
          </form>
        )}

        {mode === 'change-password' && (
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.currentPassword')}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.newPassword')}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {loading ? t('auth.changing') : t('auth.changePassword')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
