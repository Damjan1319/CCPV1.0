import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#2c2c2e] rounded-lg p-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#ebebf5] shadow-sm font-apple'
            : 'text-[#86868b] dark:text-[#ebebf5]/60 hover:text-[#1d1d1f] dark:hover:text-[#ebebf5] font-apple'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('el')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          i18n.language === 'el'
            ? 'bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#ebebf5] shadow-sm font-apple'
            : 'text-[#86868b] dark:text-[#ebebf5]/60 hover:text-[#1d1d1f] dark:hover:text-[#ebebf5] font-apple'
        }`}
      >
        EL
      </button>
    </div>
  );
}
