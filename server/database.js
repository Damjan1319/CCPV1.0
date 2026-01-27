import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Helper function for db.run with proper callback
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Promisify other methods
db.get = promisify(db.get.bind(db));
db.all = promisify(db.all.bind(db));

// Initialize database
export async function initDatabase() {
  // Users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Alerts table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_url TEXT NOT NULL,
      product_image_url TEXT,
      current_price REAL NOT NULL,
      target_price REAL NOT NULL,
      store_id TEXT,
      store_name TEXT,
      currency TEXT DEFAULT 'EUR',
      status TEXT DEFAULT 'active',
      notification_sent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_checked DATETIME,
      notified_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_user_id ON alerts(user_id)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_status ON alerts(status)`);
  await dbRun(`CREATE INDEX IF NOT EXISTS idx_email ON users(email)`);

  console.log('Database initialized');
}

// User operations
export async function createUser(email, passwordHash) {
  const result = await dbRun(
    `INSERT INTO users (email, password_hash) VALUES (?, ?)`,
    [email, passwordHash]
  );
  return result.lastID;
}

export async function getUserByEmail(email) {
  return await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
}

export async function getUserById(id) {
  return await db.get(`SELECT id, email, created_at FROM users WHERE id = ?`, [id]);
}

export async function updateUserPassword(userId, passwordHash) {
  await dbRun(
    `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [passwordHash, userId]
  );
}

// Alert operations
export async function createAlert(alertData) {
  const result = await dbRun(
    `INSERT INTO alerts (
      user_id, product_id, product_name, product_url, product_image_url,
      current_price, target_price, store_id, store_name, currency
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      alertData.userId,
      alertData.productId,
      alertData.productName,
      alertData.productUrl,
      alertData.productImageUrl || null,
      alertData.currentPrice,
      alertData.targetPrice,
      alertData.storeId || null,
      alertData.storeName || null,
      alertData.currency || 'EUR',
    ]
  );
  return result.lastID;
}

export async function getUserAlerts(userId) {
  return await db.all(
    `SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC`,
    [userId]
  );
}

export async function getActiveAlerts() {
  return await db.all(
    `SELECT a.*, u.email 
     FROM alerts a 
     JOIN users u ON a.user_id = u.id 
     WHERE a.status = 'active'`
  );
}

export async function deleteAlert(alertId, userId) {
  const result = await dbRun(
    `DELETE FROM alerts WHERE id = ? AND user_id = ?`,
    [alertId, userId]
  );
  return result.changes > 0;
}

export async function updateAlertStatus(alertId, status, notificationSent = false) {
  await dbRun(
    `UPDATE alerts 
     SET status = ?, 
         notification_sent = ?,
         notified_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE notified_at END,
         last_checked = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [status, notificationSent ? 1 : 0, notificationSent ? 1 : 0, alertId]
  );
}

export async function updateAlertPrice(alertId, currentPrice) {
  await dbRun(
    `UPDATE alerts SET current_price = ?, last_checked = CURRENT_TIMESTAMP WHERE id = ?`,
    [currentPrice, alertId]
  );
}

export default db;
