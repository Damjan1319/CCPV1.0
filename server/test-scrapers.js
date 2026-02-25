/**
 * Scraper test script
 * Usage:
 *   node test-scrapers.js                    → test all stores with "laptop"
 *   node test-scrapers.js "samsung tv"       → custom query, all stores
 *   node test-scrapers.js "laptop" bionic    → specific store
 *
 * Available store IDs: electroline, bionic, superhome, public-cy, stephanis
 */

import { searchProducts } from './scraper.js';
import { STORE_CONFIGS } from './store-configs.js';

const query     = process.argv[2] || 'laptop';
const storeId   = process.argv[3] || null;

// If a specific store is requested, temporarily filter the config
// (we import the live list then re-run searchProducts using a mini scraper)
async function testStore(config, q) {
  const { default: axios } = await import('axios');
  const cheerio = await import('cheerio');

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Store : ${config.name}  (${config.method})`);
  console.log(`URL   : ${config.baseUrl}${config.searchPath.replace('{query}', encodeURIComponent(q))}`);
  console.log(`${'─'.repeat(60)}`);

  const start = Date.now();

  try {
    // Dynamically import to avoid circular issues
    const { searchProducts: sp } = await import('./scraper.js');

    // We can't call sp() with a single store without patching STORE_CONFIGS,
    // so let's do a direct HTTP check first then run sp().
    if (config.method === 'cheerio' || config.method === 'jsonld') {
      const url = `${config.baseUrl}${config.searchPath.replace('{query}', encodeURIComponent(q))}`;
      try {
        const res = await axios.default.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120.0.0.0' },
          timeout: 10000,
          validateStatus: () => true,
        });
        console.log(`HTTP status : ${res.status}`);
        console.log(`Content-len : ${res.data?.length ?? '?'} chars`);
      } catch (e) {
        console.log(`HTTP error  : ${e.message}`);
      }
    } else {
      console.log('(Puppeteer — skipping raw HTTP check)');
    }
  } catch (e) {
    console.log(`Pre-check failed: ${e.message}`);
  }

  console.log(`\nRunning full searchProducts("${q}") …`);
  const products = await searchProducts(q);
  const elapsed  = Date.now() - start;

  const fromStore = products.filter((p) => p.store.id === config.id);
  console.log(`\nFound ${fromStore.length} products from ${config.name} in ${elapsed}ms`);

  fromStore.slice(0, 3).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name}`);
    console.log(`     Price : €${p.price.toFixed(2)}`);
    console.log(`     URL   : ${p.url}`);
    if (p.imageUrl) console.log(`     Image : ${p.imageUrl}`);
  });

  if (fromStore.length === 0) {
    console.log('\n  ⚠  No products returned. Check:');
    console.log('     • Is the search URL correct?');
    console.log('     • Are the CSS selectors right? (inspect site with F12)');
    console.log('     • For Puppeteer stores: is puppeteer installed?');
  }

  return fromStore;
}

async function main() {
  console.log(`\n=== Scraper Test | query: "${query}" ===\n`);

  const configs = storeId
    ? STORE_CONFIGS.filter((c) => c.id === storeId)
    : STORE_CONFIGS;

  if (configs.length === 0) {
    console.error(`No store found with id: "${storeId}"`);
    console.log('Available IDs:', STORE_CONFIGS.map((c) => c.id).join(', '));
    process.exit(1);
  }

  const summary = [];
  for (const config of configs) {
    const products = await testStore(config, query);
    summary.push({ store: config.name, count: products.length, method: config.method });
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'═'.repeat(60)}`);
  summary.forEach((s) => {
    const ok = s.count > 0 ? '✓' : '✗';
    console.log(`  ${ok}  ${s.store.padEnd(15)} ${String(s.count).padStart(3)} products  [${s.method}]`);
  });
  console.log('');

  process.exit(0);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
