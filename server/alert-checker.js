import { getActiveAlerts, updateAlertStatus, updateAlertPrice } from './database.js';
import { sendPriceAlertEmail } from './email.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Check price for a single alert
 */
async function checkAlertPrice(alert) {
  try {
    // In production, you would use the scraping logic from scraper.js
    // For now, this is a placeholder that would need to be implemented
    // based on the actual store configurations
    
    console.log(`Checking price for alert ${alert.id}: ${alert.product_name}`);
    
    // This would call your scraping function
    // const currentPrice = await scrapeProductPrice(alert.product_url);
    
    // For demo, we'll simulate a price check
    // In production, replace this with actual scraping
    const response = await axios.get(alert.product_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    
    // This is a placeholder - you'd need to implement actual price extraction
    // based on the store's HTML structure
    // For now, we'll use a mock price
    const currentPrice = alert.current_price * (0.95 + Math.random() * 0.1); // Simulate price change
    
    await updateAlertPrice(alert.id, currentPrice);

    if (currentPrice <= alert.target_price && !alert.notification_sent) {
      // Price dropped below target!
      await sendPriceAlertEmail(alert.email, {
        ...alert,
        current_price: currentPrice,
      });

      await updateAlertStatus(alert.id, 'triggered', true);
      console.log(`Price alert triggered for alert ${alert.id}`);
    }

    return currentPrice;
  } catch (error) {
    console.error(`Error checking alert ${alert.id}:`, error.message);
    return null;
  }
}

/**
 * Check all active alerts
 */
export async function checkAllAlerts() {
  try {
    const alerts = await getActiveAlerts();
    console.log(`Checking ${alerts.length} active alerts...`);

    // Process alerts in batches to avoid overwhelming servers
    const batchSize = 5;
    for (let i = 0; i < alerts.length; i += batchSize) {
      const batch = alerts.slice(i, i + batchSize);
      await Promise.all(batch.map(checkAlertPrice));
      
      // Add delay between batches
      if (i + batchSize < alerts.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    console.log('Finished checking alerts');
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
}

// Run alert checker if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkAllAlerts();
}
