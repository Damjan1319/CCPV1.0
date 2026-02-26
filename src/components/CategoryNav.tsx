import { useTranslation } from 'react-i18next';

export interface Category {
  id: string;
  labelKey: string;
  query: string;
  icon: React.ReactNode;
}

function LaptopIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M1 21h22" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TVIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M17 2 12 7 7 2" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M12 17h.01" strokeLinecap="round" strokeWidth={2} />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function WashingMachineIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <path d="M7 6h1M11 6h1" strokeLinecap="round" />
    </svg>
  );
}

function RefrigeratorIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 10h14" />
      <path d="M10 6v2M10 14v3" strokeLinecap="round" />
    </svg>
  );
}

function AirConditionerIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <rect x="2" y="5" width="20" height="8" rx="2" />
      <path d="M7 13v6M12 13v6M17 13v6M7 19l2-2M12 19l2-2M17 19l2-2" strokeLinecap="round" />
    </svg>
  );
}

export const CATEGORIES: Category[] = [
  { id: 'laptops', labelKey: 'categories.laptops', query: 'laptop', icon: <LaptopIcon /> },
  { id: 'smartphones', labelKey: 'categories.smartphones', query: 'smartphone', icon: <PhoneIcon /> },
  { id: 'tvs', labelKey: 'categories.tvs', query: 'tv', icon: <TVIcon /> },
  { id: 'tablets', labelKey: 'categories.tablets', query: 'tablet', icon: <TabletIcon /> },
  { id: 'headphones', labelKey: 'categories.headphones', query: 'headphones', icon: <HeadphonesIcon /> },
  { id: 'cameras', labelKey: 'categories.cameras', query: 'camera', icon: <CameraIcon /> },
  { id: 'washingMachines', labelKey: 'categories.washingMachines', query: 'washing machine', icon: <WashingMachineIcon /> },
  { id: 'refrigerators', labelKey: 'categories.refrigerators', query: 'refrigerator', icon: <RefrigeratorIcon /> },
  { id: 'airConditioners', labelKey: 'categories.airConditioners', query: 'air conditioner', icon: <AirConditionerIcon /> },
];

interface CategoryNavProps {
  activeCategory: string | null;
  onSelect: (id: string, query: string) => void;
}

export function CategoryNav({ activeCategory, onSelect }: CategoryNavProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#1c1c1e] border-b border-gray-200 dark:border-[#38383a] sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-2.5 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id, cat.query)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-gray-900 dark:bg-[#007AFF] text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2c2c2e] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat.icon}
              {t(cat.labelKey, { defaultValue: cat.id })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
