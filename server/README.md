# Backend API Server za Price Comparison

Ovaj server omogućava web scraping sa stvarnih sajtova.

## Instalacija

```bash
cd server
npm install
```

## Pokretanje

```bash
# Development mode (sa auto-reload)
npm run dev

# Production mode
npm start
```

Server će biti dostupan na `http://localhost:3001`

## Konfiguracija Store-ova

1. Otvorite `store-configs.js`
2. Za svaki store, dodajte konfiguraciju sa CSS selektorima
3. Da biste pronašli selektore:
   - Otvorite sajt prodavnice u browseru
   - Pritisnite F12 (Developer Tools)
   - Koristite "Inspect Element" da vidite HTML strukturu
   - Pronađite CSS selektore za:
     - Kontejner proizvoda
     - Naziv proizvoda
     - Cenu
     - Link ka proizvodu
     - Sliku (opciono)
     - Ocenu (opciono)

## API Endpoints

### POST /api/search

Pretražuje proizvode na svim konfigurisanim store-ovima.

**Request:**
```json
{
  "query": "laptop",
  "location": "nicosia" // opciono
}
```

**Response:**
```json
{
  "success": true,
  "products": [...],
  "count": 15
}
```

## Napomene

- Poštujte `robots.txt` svakog sajta
- Proverite Terms of Service pre scraping-a
- Koristite razumne delay-e između zahteva
- Razmotrite korišćenje proxy servera za veće obimne scraping
- Za dinamičke sajtove (React/Vue), razmotrite Puppeteer ili Playwright

## Za dinamičke sajtove

Ako store koristi JavaScript za učitavanje proizvoda, možete koristiti Puppeteer:

```bash
npm install puppeteer
```

Zatim u `scraper.js`:
```javascript
import puppeteer from 'puppeteer';

async function scrapeWithPuppeteer(query, config) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(searchUrl);
  await page.waitForSelector(config.selectors.productContainer);
  const html = await page.content();
  // ... continue with cheerio
  await browser.close();
}
```
