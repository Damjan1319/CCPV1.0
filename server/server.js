import express from 'express';
import cors from 'cors';
import { searchProducts } from './scraper.js';
import {
  initDatabase,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserPassword,
  createAlert,
  getUserAlerts,
  getActiveAlerts,
  deleteAlert,
  updateAlertStatus,
  updateAlertPrice,
} from './database.js';
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generateRandomPassword,
} from './auth.js';
import { sendWelcomeEmail, sendPriceAlertEmail } from './email.js';
import cron from 'node-cron';
import { checkAllAlerts } from './alert-checker.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize database on startup
await initDatabase();

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Search products endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query, location } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log(`Searching for: ${query}${location ? ` in ${location}` : ''}`);

    const products = await searchProducts(query, location);

    res.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while searching',
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate random password
    const password = generateRandomPassword();
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = await createUser(email, passwordHash);

    // Send welcome email with password
    try {
      await sendWelcomeEmail(email, password);
    } catch (emailError) {
      console.error('Failed to send email, but user created:', emailError);
      // User is still created, they can request password reset
    }

    res.json({
      success: true,
      message: 'Account created. Check your email for password.',
      userId,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
});

// Change password endpoint
app.post('/api/auth/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const user = await getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await hashPassword(newPassword);
    await updateUserPassword(user.id, newPasswordHash);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to change password',
    });
  }
});

// Get user alerts
app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = await getUserAlerts(req.user.userId);
    res.json({
      success: true,
      alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get alerts',
    });
  }
});

// Create alert
app.post('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const {
      productId,
      productName,
      productUrl,
      productImageUrl,
      currentPrice,
      targetPrice,
      storeId,
      storeName,
      currency,
    } = req.body;

    if (!productId || !productName || !productUrl || !currentPrice || !targetPrice) {
      return res.status(400).json({
        error: 'productId, productName, productUrl, currentPrice, and targetPrice are required',
      });
    }

    if (targetPrice >= currentPrice) {
      return res.status(400).json({
        error: 'Target price must be less than current price',
      });
    }

    const alertId = await createAlert({
      userId: req.user.userId,
      productId,
      productName,
      productUrl,
      productImageUrl,
      currentPrice: parseFloat(currentPrice),
      targetPrice: parseFloat(targetPrice),
      storeId,
      storeName,
      currency: currency || 'EUR',
    });

    res.json({
      success: true,
      alertId,
      message: 'Alert created successfully',
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create alert',
    });
  }
});

// Delete alert
app.delete('/api/alerts/:id', authenticateToken, async (req, res) => {
  try {
    const alertId = parseInt(req.params.id);
    const deleted = await deleteAlert(alertId, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully',
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete alert',
    });
  }
});

// Schedule alert checking (every 6 hours)
// In production, you might want to adjust this frequency
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled alert check...');
  checkAllAlerts();
});

// Also check alerts on startup (optional)
if (process.env.CHECK_ALERTS_ON_STARTUP === 'true') {
  setTimeout(() => {
    console.log('Running initial alert check...');
    checkAllAlerts();
  }, 5000);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Alert checker scheduled to run every 6 hours');
});
