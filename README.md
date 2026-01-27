# Price Comparison Cyprus

Aplikacija za poređenje cena proizvoda na tržištu Kipra sa podrškom za engleski i grčki jezik.

## Funkcionalnosti

- 🔍 Pretraga proizvoda
- 💰 Poređenje cena iz više prodavnica
- ⭐ Prikaz ocena i kvaliteta usluge
- 🚚 Informacije o brzini dostave
- 🌐 Podrška za engleski i grčki jezik
- 🎨 Moderni i responzivni dizajn
- 📍 Filter po lokacijama (gradovi na Kipru)
- 💵 Filter po cenovnom opsegu
- 🏪 Filter po prodavnicama
- 🔄 Direktno poređenje proizvoda (do 3)
- 🔔 Price Alerts (za registrovane korisnike)
- 👤 User Authentication (registracija, login, promena password-a)

## Tehnologije

- **React** - UI biblioteka
- **TypeScript** - Tipizirani JavaScript
- **Vite** - Build tool
- **Tailwind CSS** - CSS framework
- **React i18next** - Internacionalizacija
- **Cheerio** - Web scraping
- **Axios** - HTTP klijent

## Instalacija

### Frontend
```bash
npm install
```

### Backend (za scraping sa stvarnih sajtova)
```bash
cd server
npm install
```

## Pokretanje

### Development (sa mock podacima)
```bash
npm run dev
```
Aplikacija će biti dostupna na `http://localhost:5173`

### Sa stvarnim scraping-om

1. **Pokrenite backend server:**
   ```bash
   cd server
   npm run dev
   ```
   Backend će biti dostupan na `http://localhost:3001`

2. **Kreirajte `.env` fajl u root direktorijumu:**
   ```bash
   VITE_API_URL=http://localhost:3001
   ```

3. **Pokrenite frontend:**
   ```bash
   npm run dev
   ```

4. **Konfigurišite store-ove:**
   - Otvorite `server/store-configs.js`
   - Dodajte konfiguracije za stvarne sajtove
   - Detaljne instrukcije u `IMPLEMENTATION_GUIDE.md`

## Build za produkciju

```bash
npm run build
```

## Struktura projekta

```
src/
├── components/       # React komponente
│   ├── SearchBar.tsx
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── FilterBar.tsx
│   └── LanguageSwitcher.tsx
├── hooks/           # Custom React hooks
│   └── useProductSearch.ts
├── lib/             # Utility funkcije
│   ├── i18n.ts      # i18n konfiguracija
│   └── scraper.ts   # Web scraping logika
├── locales/         # Prevodi
│   ├── en.json      # Engleski
│   └── el.json      # Grčki
├── types/           # TypeScript tipovi
│   └── index.ts
└── App.tsx          # Glavna komponenta
```

## Konfiguracija Scraping-a sa stvarnim sajtovima

Za detaljne instrukcije, pogledajte **`IMPLEMENTATION_GUIDE.md`**

### Brzi start:

1. **Dodajte store konfiguracije u `server/store-configs.js`:**
   ```javascript
   {
     id: 'store1',
     name: 'Store Name',
     baseUrl: 'https://store-url.com',
     searchPath: '/search?q={query}',
     selectors: {
       productContainer: '.product-item',
       productName: '.product-title',
       productPrice: '.price',
       // ...
     },
   }
   ```

2. **Pronađite CSS selektore:**
   - Otvorite sajt u browseru
   - Pritisnite F12 (Developer Tools)
   - Koristite "Inspect Element" da vidite HTML strukturu
   - Kopirajte CSS selektore

3. **Testirajte:**
   ```bash
   curl -X POST http://localhost:3001/api/search \
     -H "Content-Type: application/json" \
     -d '{"query": "laptop"}'
   ```

## Price Alerts

Za korišćenje Price Alerts funkcionalnosti:

1. **Registrujte se** - samo email je potreban
2. **Proverite email** - password će biti poslat na vašu adresu
3. **Ulogujte se** sa primljenim password-om
4. **Postavite alert** - kliknite na 🔔 ikonu na proizvodu
5. **Unesite target cenu** - cena ispod koje želite obaveštenje
6. **Pratite alertove** - kliknite na "My Price Alerts" u header-u

Alert checker automatski proverava cene svakih 6 sati i šalje email obaveštenja kada cena padne.

**Napomena:** Za produkciju, sve se čuva u bazi podataka (SQLite), bez localStorage.

## Napomene

- **Mock podaci**: Aplikacija koristi mock podatke ako backend nije dostupan
- **Backend server**: Za scraping sa stvarnih sajtova i alerts, potreban je backend server (već kreiran u `server/` folderu)
- **Email konfiguracija**: Potrebna je za slanje password-a i alert obaveštenja (vidi `server/SETUP.md`)
- **Database**: SQLite se koristi za development, za produkciju razmotrite PostgreSQL/MySQL
- **Legalne napomene**: 
  - Poštujte `robots.txt` svakog sajta
  - Proverite Terms of Service pre scraping-a
  - Neki sajtovi zabranjuju scraping
  - Razmotrite kontaktiranje sajtova za API pristup
- **Rate limiting**: Dodajte delay-e između zahteva da ne preopteretite servere
- **Dinamički sajtovi**: Za React/Vue sajtove, koristite Puppeteer (instrukcije u `IMPLEMENTATION_GUIDE.md`)

## Licenca

MIT
