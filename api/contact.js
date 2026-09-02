// ================================================================
// api/contact.js — Vercel Serverless Function Endpoint
// ================================================================
// Handles POST /api/contact when deployed on Vercel.
// Integrates Express, helmet, cors, input validation, rate limiting
// and Nodemailer email dispatching into a serverless handler.
// ================================================================

// Load environment variables if running locally via Vercel CLI
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });
} catch (e) {
  // Dotenv optional in production (Vercel provides process.env natively)
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { corsOptions } = require('../backend/config/cors');
const contactRoutes = require('../backend/routes/contactRoutes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());

// Enforce strict CORS allowlist & handle OPTIONS preflights
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Trust Vercel proxy headers for rate limiting IP detection
app.set('trust proxy', 1);

// Mount Contact Routes at root and subpath variations so Vercel rewrites or direct invocations match
app.use('/', contactRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact.js', contactRoutes);

// Fallback JSON 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Fallback JSON Error handler
app.use((err, req, res, next) => {
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }
  console.error('❌ Serverless Contact API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Internal server error in Contact API. Please try again later.',
  });
});

// Export for Vercel Serverless Function
module.exports = app;

