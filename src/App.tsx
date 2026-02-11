import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useProductSearch } from './hooks/useProductSearch';
import { useDarkMode } from './hooks/useDarkMode';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { ProductSlider } from './components/ProductSlider';
import { PromoBanner } from './components/PromoBanner';
import { TopStores } from './components/TopStores';
import { Footer } from './components/Footer';
import { FilterBar, sortProducts } from './components/FilterBar';
import { LocationFilter } from './components/LocationFilter';
import { PriceRangeFilter } from './components/PriceRangeFilter';
import { StoreFilter } from './components/StoreFilter';
import { CompareProducts } from './components/CompareProducts';
import { AuthModal } from './components/AuthModal';
import { SetAlertModal } from './components/SetAlertModal';
import { AlertsList } from './components/AlertsList';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { DarkModeToggle } from './components/DarkModeToggle';
import { HamburgerMenu } from './components/HamburgerMenu';
import { isAuthenticated, authAPI } from './lib/api';
import { getMostSearchedDevices, getBestRatedProducts, getLatestDeals, getFastestDeliveryProducts } from './utils/homeSections';
import { STORES } from './lib/scraper';
import type { SortOption } from './components/FilterBar';
import type { Product } from './types';
import './lib/i18n';

function App() {
  const { t } = useTranslation();
  const { products, loading, error, search } = useProductSearch();
  useDarkMode(); // Initialize dark mode
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'register' | 'login' | 'change-password'>('login');
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSetAlertModal, setShowSetAlertModal] = useState(false);
  const [selectedProductForAlert, setSelectedProductForAlert] = useState<Product | null>(null);
  
  // Home page slider products
  const [mostSearchedDevices] = useState<Product[]>(() => getMostSearchedDevices());
  const [bestRatedProducts] = useState<Product[]>(() => getBestRatedProducts());
  const [latestDeals] = useState<Product[]>(() => getLatestDeals());
  const [fastestDelivery] = useState<Product[]>(() => getFastestDeliveryProducts());

  // Check authentication on mount
  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search(query, selectedLocation === 'all' ? undefined : selectedLocation);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    if (searchQuery) {
      search(searchQuery, location === 'all' ? undefined : location);
    }
  };

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Initialize price range when products change (only if not manually set)
  useMemo(() => {
    if (products.length > 0 && (minPrice === 0 || maxPrice === 0 || minPrice > maxPrice)) {
      setMinPrice(priceRange.min);
      setMaxPrice(priceRange.max);
    }
  }, [products, priceRange]);

  // Filter products by location, price range, and stores
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter((product) => {
        if (product.store.coversIsland) {
          return true;
        }
        return product.store.city === selectedLocation || product.store.location === selectedLocation;
      });
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      return product.price >= minPrice && product.price <= maxPrice;
    });

    // Filter by stores
    if (selectedStores.length > 0) {
      filtered = filtered.filter((product) => selectedStores.includes(product.store.id));
    }

    return filtered;
  }, [products, selectedLocation, minPrice, maxPrice, selectedStores]);

  const sortedProducts = sortProducts(filteredProducts, sortOption);

  // Handle compare
  const handleCompare = (product: Product) => {
    if (compareProducts.length >= 3) return;
    if (compareProducts.some((p) => p.id === product.id)) return;
    setCompareProducts([...compareProducts, product]);
  };

  const handleRemoveCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter((p) => p.id !== productId));
  };

  const handleClearCompare = () => {
    setCompareProducts([]);
  };

  const handleStoreToggle = (storeId: string) => {
    if (selectedStores.includes(storeId)) {
      setSelectedStores(selectedStores.filter((id) => id !== storeId));
    } else {
      setSelectedStores([...selectedStores, storeId]);
    }
  };

  // Auth handlers
  const handleAuthSuccess = () => {
    setAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authAPI.logout();
    setAuthenticated(false);
    setShowAlerts(false);
  };

  const handleSetAlert = (product: Product) => {
    if (!authenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    setSelectedProductForAlert(product);
    setShowSetAlertModal(true);
  };

  const handleAlertCreated = () => {
    setShowSetAlertModal(false);
    setSelectedProductForAlert(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#000000] flex flex-col overflow-x-hidden">
      <header className="bg-white dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-[#38383a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em] leading-none font-apple">
                {t('app.title')}
              </h1>
              <p className="text-sm text-[#86868b] dark:text-[#ebebf5] mt-1.5 font-medium font-apple">
                {t('app.subtitle')}
              </p>
            </div>
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4">
              <DarkModeToggle />
              {authenticated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAlerts(!showAlerts)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {t('alerts.title')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('change-password');
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {t('auth.changePassword')}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              )}
              {!authenticated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {t('auth.register')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 bg-gray-900 dark:bg-[#007AFF] text-white rounded-md hover:bg-gray-800 dark:hover:bg-[#0051D5] text-sm font-medium font-apple"
                  >
                    {t('auth.login')}
                  </button>
                </div>
              )}
              <LanguageSwitcher />
            </div>
            {/* Mobile Hamburger Menu */}
            <div className="lg:hidden">
              <HamburgerMenu
                authenticated={authenticated}
                onShowAlerts={() => setShowAlerts(!showAlerts)}
                onShowChangePassword={() => {
                  setAuthMode('change-password');
                  setShowAuthModal(true);
                }}
                onLogout={handleLogout}
                onShowRegister={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                onShowLogin={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* SearchBar - Always visible, full width */}
      {!showAlerts && (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      )}

      <main className={`${products.length > 0 && searchQuery ? 'w-full' : 'max-w-7xl mx-auto'} px-4 sm:px-6 lg:px-8 py-8 flex-1`}>
        {showAlerts ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('alerts.title')}</h2>
              <button
                onClick={() => setShowAlerts(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                ← Back to Search
              </button>
            </div>
            <AlertsList />
          </div>
        ) : (
          <>

            {/* Home Page Sliders - Only show when no search results */}
            {products.length === 0 && !loading && !searchQuery && (
              <div className="space-y-12">
                <ProductSlider
                  title={t('home.mostSearched', { defaultValue: 'Most Searched Devices' })}
                  products={mostSearchedDevices}
                  onCompare={handleCompare}
                  onSetAlert={handleSetAlert}
                  isAuthenticated={authenticated}
                />
                
                <ProductSlider
                  title={t('home.bestRated', { defaultValue: 'Best Rated Products' })}
                  products={bestRatedProducts}
                  onCompare={handleCompare}
                  onSetAlert={handleSetAlert}
                  isAuthenticated={authenticated}
                />
                
                <ProductSlider
                  title={t('home.latestDeals', { defaultValue: 'Latest Deals' })}
                  products={latestDeals}
                  onCompare={handleCompare}
                  onSetAlert={handleSetAlert}
                  isAuthenticated={authenticated}
                />
                
                <ProductSlider
                  title={t('home.fastestDelivery', { defaultValue: 'Fastest Delivery' })}
                  products={fastestDelivery}
                  onCompare={handleCompare}
                  onSetAlert={handleSetAlert}
                  isAuthenticated={authenticated}
                />

                {/* Promo Banner */}
                <PromoBanner />

                {/* Top Stores */}
                <TopStores stores={STORES} />
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Show "no results" only when user searched but found nothing */}
            {searchQuery && products.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-lg text-gray-500 dark:text-gray-400">{t('search.noResults')}</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="mb-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-[#1c1c1e] rounded-lg border border-gray-200 dark:border-[#38383a]">
                  <LocationFilter
                    selectedLocation={selectedLocation}
                    onLocationChange={handleLocationChange}
                  />
                  <PriceRangeFilter
                    minPrice={priceRange.min}
                    maxPrice={priceRange.max}
                    currentMin={minPrice}
                    currentMax={maxPrice}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                  />
                  <FilterBar onSort={setSortOption} currentSort={sortOption} />
                  <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    {sortedProducts.length === 1
                      ? t('search.resultsCount', { count: sortedProducts.length })
                      : t('search.resultsCountPlural', { count: sortedProducts.length })}
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-[#1c1c1e] rounded-lg border border-gray-200 dark:border-[#38383a]">
                  <StoreFilter
                    products={products}
                    selectedStores={selectedStores}
                    onStoreToggle={handleStoreToggle}
                  />
                </div>
              </div>
            )}

            <ProductList
              products={sortedProducts}
              loading={loading}
              onCompare={handleCompare}
              compareProducts={compareProducts}
              onSetAlert={handleSetAlert}
              isAuthenticated={authenticated}
            />
          </>
        )}
      </main>

      {compareProducts.length > 0 && (
        <CompareProducts
          products={compareProducts}
          onRemove={handleRemoveCompare}
          onClear={handleClearCompare}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        mode={authMode}
      />

      <SetAlertModal
        isOpen={showSetAlertModal}
        onClose={() => {
          setShowSetAlertModal(false);
          setSelectedProductForAlert(null);
        }}
        product={selectedProductForAlert}
        onSuccess={handleAlertCreated}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
