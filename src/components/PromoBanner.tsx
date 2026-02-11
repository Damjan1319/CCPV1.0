import { useTranslation } from 'react-i18next';

export function PromoBanner() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-2xl mb-12">
      <div 
        className="relative p-8 md:p-12 lg:p-16"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('banner.title', { defaultValue: 'Save More, Shop Smarter' })}
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            {t('banner.description', { 
              defaultValue: 'Compare prices from thousands of stores and find the best deals. Get price alerts and never miss a sale again!' 
            })}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base">{t('banner.feature1', { defaultValue: 'Compare prices instantly' })}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm md:text-base">{t('banner.feature2', { defaultValue: 'Price alerts' })}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm md:text-base">{t('banner.feature3', { defaultValue: 'Best deals guaranteed' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
