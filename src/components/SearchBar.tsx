import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Hero Section with Search */}
      <div 
        className="rounded-2xl p-12 md:p-16 lg:p-20 shadow-xl relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          {/* Heading */}
          <div className="text-left mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 leading-tight font-apple tracking-[-0.01em]">
              {t('search.hero.title', { defaultValue: 'Search, compare, save' })}
            </h2>
            <p className="text-lg md:text-xl text-white/90 font-apple">
              {t('search.hero.subtitle', { defaultValue: 'Find your next deal today' })}
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2 sm:gap-3 bg-white dark:bg-[#1c1c1e] rounded-xl p-2 shadow-lg">
              <div className="flex-1 flex items-center min-w-0">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-2 sm:ml-4 mr-2 sm:mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.hero.placeholder', { defaultValue: 'What are you looking for today?' })}
                  className="flex-1 py-3 sm:py-4 px-1 sm:px-2 text-[#1d1d1f] dark:text-white bg-transparent focus:outline-none placeholder-[#86868b] dark:placeholder-[#ebebf5]/60 text-sm sm:text-base md:text-lg min-w-0 font-apple"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-[#2c2c2e] text-white rounded-lg hover:bg-gray-800 dark:hover:bg-[#38383a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg font-apple"
                aria-label={loading ? t('search.loading') : t('search.button')}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>

          {/* Stats or additional info */}
          <div className="mt-6 text-left">
            <p className="text-sm md:text-base text-white/80 font-apple">
              {t('search.hero.stats', {
                defaultValue: 'Compare prices from multiple stores',
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
