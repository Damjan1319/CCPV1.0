import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HamburgerMenuProps {
  authenticated: boolean;
  onShowAlerts: () => void;
  onShowChangePassword: () => void;
  onLogout: () => void;
  onShowRegister: () => void;
  onShowLogin: () => void;
}

export function HamburgerMenu({
  authenticated,
  onShowAlerts,
  onShowChangePassword,
  onLogout,
  onShowRegister,
  onShowLogin,
}: HamburgerMenuProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.hamburger-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="hamburger-menu relative lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg border border-gray-300 dark:border-[#38383a] bg-white dark:bg-[#1c1c1e] text-gray-700 dark:text-[#ebebf5] hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-[#1c1c1e] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Settings Section */}
            <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('app.settings')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DarkModeToggle />
                <LanguageSwitcher />
              </div>
            </div>

            {/* Auth Section */}
            {authenticated ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowAlerts();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  {t('alerts.title')}
                </button>
                <button
                  onClick={() => {
                    onShowChangePassword();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  {t('auth.changePassword')}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onShowRegister();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  {t('auth.register')}
                </button>
                <button
                  onClick={() => {
                    onShowLogin();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-900 dark:bg-[#007AFF] text-white hover:bg-gray-800 dark:hover:bg-[#0051D5] transition-colors font-medium text-center font-apple"
                >
                  {t('auth.login')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
