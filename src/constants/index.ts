export const SUPPORTED_LANGUAGES = ['en', 'el'] as const;
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_CURRENCY = 'EUR';

export const SORT_OPTIONS = {
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  RATING: 'rating',
  DELIVERY: 'delivery',
} as const;

export const DEBOUNCE_DELAY = 300; // milliseconds

// Cyprus cities and locations
export const CYPRUS_CITIES = [
  { value: 'all', labelEn: 'Entire Island', labelEl: 'Ολόκληρο Νησί' },
  { value: 'nicosia', labelEn: 'Nicosia', labelEl: 'Λευκωσία' },
  { value: 'limassol', labelEn: 'Limassol', labelEl: 'Λεμεσός' },
  { value: 'larnaca', labelEn: 'Larnaca', labelEl: 'Λάρνακα' },
  { value: 'paphos', labelEn: 'Paphos', labelEl: 'Πάφος' },
  { value: 'ayia-napa', labelEn: 'Ayia Napa', labelEl: 'Αγία Νάπα' },
  { value: 'protaras', labelEn: 'Protaras', labelEl: 'Πρωταράς' },
  { value: 'paralimni', labelEn: 'Paralimni', labelEl: 'Παραλίμνι' },
  { value: 'kyrenia', labelEn: 'Kyrenia', labelEl: 'Κερύνεια' },
  { value: 'morphou', labelEn: 'Morphou', labelEl: 'Μόρφου' },
] as const;
