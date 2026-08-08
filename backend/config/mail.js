// ================================================================
// config/mail.js — Nodemailer SMTP Transport Configuration
// ================================================================
// Creates and exports a reusable Nodemailer transporter instance
// configured for Gmail SMTP using App Password authentication.
// All credentials are read from environment variables — nothing
// is ever hardcoded.
// ================================================================

const nodemailer = require('nodemailer');

/**
 * Gmail SMTP transporter.
 *
 * Configuration notes:
 * - Explicit host/port/secure settings work reliably on both the
 *    standalone Express server and Vercel serverless functions.
 * - `auth.pass` must be a Gmail App Password, NOT the account
 *    password.  See README.md for setup instructions.
 * - Do NOT enable `pool: true` — connection pooling causes SMTP
 *    hangs and timeouts in short-lived serverless invocations.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Verify the transporter can authenticate with Gmail on startup.
 * Logs success or failure — does NOT crash the server so that
 * other endpoints (like /api/health) still work even if the
 * email config is temporarily wrong.
 */
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅  Mail transporter verified — ready to send emails.');
  } catch (error) {
    console.error('❌  Mail transporter verification failed:', error.message);
    console.error('    Check EMAIL_USER and EMAIL_PASS in your .env file.');
  }
};

module.exports = { transporter, verifyTransporter };
