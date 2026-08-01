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
 * - `service: 'gmail'` is a Nodemailer shortcut that sets
 *    host/port/secure automatically for Gmail SMTP.
 * - `auth.pass` must be a Gmail App Password, NOT the account
 *    password.  See README.md for setup instructions.
 * - `pool: true` keeps a connection pool open so that multiple
 *    emails can be sent without re-establishing TLS each time.
 * - `maxConnections` and `maxMessages` guard against accidental
 *    flooding of the Gmail API.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
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
