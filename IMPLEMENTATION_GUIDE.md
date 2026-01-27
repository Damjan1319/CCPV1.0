# Vodič za implementaciju sa stvarnim sajtovima

## Korak 1: Instalacija Backend Servera

```bash
cd server
npm install
```

## Korak 2: Konfiguracija Store-ova

1. Otvorite `server/store-configs.js`
2. Za svaki store koji želite da scrapujete:

### Kako pronaći CSS selektore:

1. **Otvorite sajt prodavnice u browseru**
2. **Pritisnite F12** da otvorite Developer Tools
3. **Koristite "Inspect Element"** (desni klik → Inspect)
4. **Pronađite HTML strukturu proizvoda:**
   - Kontejner koji wrap-uje jedan proizvod
   - Element sa nazivom proizvoda
   - Element sa cenom
   - Link ka proizvodu
   - Slika proizvoda (opciono)
   - Ocena (opciono)

### Primer konfiguracije:

```javascript
{
  id: 'cyprus-electronics',
  name: 'Cyprus Electronics',
  baseUrl: 'https://www.cypruselectronics.com',
  searchPath: '/search?q={query}', // {query} će biti zamenjen sa search termom
  currency: 'EUR',
  rating: 4.5,
  deliverySpeed: '2-3 days',
  serviceQuality: 4.2,
  city: 'nicosia',
  location: 'Nicosia',
  coversIsland: true,
  maxResults: 10,
  selectors: {
    productContainer: '.product-card',      // CSS selector za kontejner proizvoda
    productName: '.product-title',          // CSS selector za naziv
    productPrice: '.price-value',           // CSS selector za cenu
    productLink: 'a.product-link',         // CSS selector za link
    productImage: 'img.product-image',     // CSS selector za sliku (opciono)
    productRating: '.rating',               // CSS selector za ocenu (opciono)
  },
}
```

### Korisni alati za pronalaženje selektora:

- **Chrome DevTools**: Elements tab → desni klik na element → Copy → Copy selector
- **Firefox DevTools**: Inspector → desni klik → Copy → CSS Selector
- **Online alati**: SelectorGadget, CSS Selector Helper

## Korak 3: Testiranje Scraping-a

1. **Pokrenite backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Testirajte API direktno:**
   ```bash
   curl -X POST http://localhost:3001/api/search \
     -H "Content-Type: application/json" \
     -d '{"query": "laptop", "location": "nicosia"}'
   ```

3. **Ili koristite Postman/Insomnia** za testiranje

## Korak 4: Podešavanje Frontend-a

1. **Kreirajte `.env` fajl u root direktorijumu:**
   ```bash
   VITE_API_URL=http://localhost:3001
   ```

2. **Restartujte frontend dev server:**
   ```bash
   npm run dev
   ```

## Korak 5: Za dinamičke sajtove (React/Vue/Angular)

Ako store koristi JavaScript za renderovanje proizvoda, trebate koristiti headless browser:

### Instalacija Puppeteer:

```bash
cd server
npm install puppeteer
```

### Ažuriranje scraper.js:

```javascript
import puppeteer from 'puppeteer';

async function scrapeWithPuppeteer(query, config) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  const searchUrl = `${config.baseUrl}${config.searchPath.replace('{query}', encodeURIComponent(query))}`;
  
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });
  
  // Sačekaj da se proizvodi učitaju
  await page.waitForSelector(config.selectors.productContainer, { timeout: 10000 });
  
  // Uzmi HTML
  const html = await page.content();
  await browser.close();
  
  // Koristi cheerio za parsiranje
  const $ = cheerio.load(html);
  // ... nastavite sa parsiranjem kao u običnom scraper-u
}
```

## Korak 6: Pravila i ograničenja

### Poštujte robots.txt:
- Proverite `https://sajt.com/robots.txt`
- Poštujte `Crawl-delay` i zabranjene putanje

### Rate Limiting:
- Dodajte delay između zahteva:
  ```javascript
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sekunda delay
  ```

### User-Agent:
- Koristite realističan User-Agent (već je uključen u kod)

### Legalne napomene:
- Proverite Terms of Service svakog sajta
- Neki sajtovi zabranjuju scraping
- Razmotrite kontaktiranje sajtova za API pristup

## Korak 7: Produkcija

### Environment Variables:
```bash
# server/.env
PORT=3001
NODE_ENV=production
```

### Deployment:
- Backend: Deploy na VPS (DigitalOcean, AWS, etc.) ili serverless (Vercel, Netlify Functions)
- Frontend: Deploy na Vercel, Netlify, ili bilo koji static hosting

### Proxy Server (opciono):
Ako imate problema sa CORS ili IP blocking:
```bash
npm install http-proxy-middleware
```

## Troubleshooting

### Problem: "Cannot find module"
**Rešenje:** Proverite da li ste u `server` direktorijumu i da li ste pokrenuli `npm install`

### Problem: "Timeout" ili "Connection refused"
**Rešenje:** 
- Proverite da li je backend server pokrenut
- Proverite da li je port 3001 slobodan
- Proverite firewall settings

### Problem: "No products found"
**Rešenje:**
- Proverite CSS selektore u browser DevTools
- Možda sajt koristi JavaScript za renderovanje (koristite Puppeteer)
- Proverite da li URL za pretragu je tačan

### Problem: "CORS error"
**Rešenje:**
- Backend već ima CORS middleware
- Proverite da li frontend koristi tačan API URL

## Primeri stvarnih sajtova na Kipru

Neki od sajtova koje možete scrapovati:
- Electronics stores
- Supermarkets
- Online marketplaces
- Specialized stores

**Napomena:** Uvek proverite Terms of Service pre scraping-a!
