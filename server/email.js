import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email configuration
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error) => {
    if (error) {
      console.error('Email configuration error:', error);
    } else {
      console.log('Email server is ready');
    }
  });
}

/**
 * Send welcome email with password
 */
export async function sendWelcomeEmail(email, password) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not configured. Would send to:', email);
    console.log('Password:', password);
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Welcome to CCP - Your Account Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to CCP - Price Comparison Cyprus</h2>
        <p>Thank you for registering! Your account has been created.</p>
        <p><strong>Your temporary password is:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <code style="font-size: 18px; font-weight: bold; color: #333;">${password}</code>
        </div>
        <p>Please log in and change your password in your account settings.</p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `,
    text: `
Welcome to CCP - Price Comparison Cyprus

Thank you for registering! Your account has been created.

Your temporary password is: ${password}

Please log in and change your password in your account settings.

If you didn't create this account, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

/**
 * Send price alert notification
 */
export async function sendPriceAlertEmail(email, alert) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Email not configured. Would send price alert to:', email);
    return;
  }

  const savings = alert.current_price - alert.target_price;
  const savingsPercent = ((savings / alert.current_price) * 100).toFixed(1);

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: `Price Alert: ${alert.product_name} - Price Dropped!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Great News! Price Dropped</h2>
        <p>The price for <strong>${alert.product_name}</strong> has dropped!</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Current Price:</strong> <span style="font-size: 24px; color: #059669;">€${alert.current_price.toFixed(2)}</span></p>
          <p style="margin: 5px 0;"><strong>Your Target:</strong> €${alert.target_price.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>You Save:</strong> <span style="color: #059669; font-weight: bold;">€${savings.toFixed(2)} (${savingsPercent}%)</span></p>
          <p style="margin: 5px 0;"><strong>Store:</strong> ${alert.store_name || 'N/A'}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="${alert.product_url}" 
             style="background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Product
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          This alert will remain active until you remove it from your account.
        </p>
      </div>
    `,
    text: `
Great News! Price Dropped

The price for ${alert.product_name} has dropped!

Current Price: €${alert.current_price.toFixed(2)}
Your Target: €${alert.target_price.toFixed(2)}
You Save: €${savings.toFixed(2)} (${savingsPercent}%)
Store: ${alert.store_name || 'N/A'}

View Product: ${alert.product_url}

This alert will remain active until you remove it from your account.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Price alert email sent to ${email}`);
  } catch (error) {
    console.error('Error sending price alert email:', error);
    throw error;
  }
}
