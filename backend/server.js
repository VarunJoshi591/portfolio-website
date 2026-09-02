// ================================================================
// server.js — Express Application Entry Point
// ================================================================
// This is the main file that:
//   1. Loads environment variables (dotenv).
//   2. Initialises Express with security middleware (Helmet, CORS).
//   3. Applies global rate limiting.
//   4. Registers API routes.
//   5. Defines a health-check endpoint.
//   6. Handles 404 and global errors.
//   7. Starts the HTTP server with graceful shutdown support.
//   8. Verifies the mail transporter on startup.
// ================================================================

// ------------------------------------------------------------------
// 1. Load environment variables FIRST (before any other import)
// ------------------------------------------------------------------
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// ------------------------------------------------------------------
// 2. Core dependencies
// ------------------------------------------------------------------
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// ------------------------------------------------------------------
// 3. Custom modules
// ------------------------------------------------------------------
const { globalLimiter } = require('./middleware/rateLimiter');
const contactRoutes = require('./routes/contactRoutes');
const { verifyTransporter } = require('./config/mail');
const { corsOptions } = require('./config/cors');

// ------------------------------------------------------------------
// 4. Initialise Express app
// ------------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------------
// 5. Security middleware
// ------------------------------------------------------------------

// Helmet — sets various HTTP headers to protect against common attacks
app.use(helmet());

// CORS — strict allowlist matching
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ------------------------------------------------------------------
// 6. Global middleware
// ------------------------------------------------------------------

// Parse incoming JSON payloads (limit body size to prevent abuse)
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// HTTP request logger (use 'combined' in production for full logs)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Global rate limiter (100 requests per 15 min per IP)
app.use(globalLimiter);

// Trust proxy — required when deployed behind Render/Heroku/Nginx
// so that express-rate-limit reads the real client IP from
// X-Forwarded-For instead of always seeing 127.0.0.1.
app.set('trust proxy', 1);

// ------------------------------------------------------------------
// 7. API routes
// ------------------------------------------------------------------

// Contact form endpoint
app.use('/api/contact', contactRoutes);

// ------------------------------------------------------------------
// 8. Health check endpoint
// ------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy and running.',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
  });
});

// ------------------------------------------------------------------
// 9. 404 handler — catches all undefined routes
// ------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ------------------------------------------------------------------
// 10. Global error handler
// ------------------------------------------------------------------
// Express identifies error-handling middleware by the 4-parameter
// signature (err, req, res, next).
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('💥  Unhandled Error:', err.message);

  // CORS errors
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ------------------------------------------------------------------
// 11. Start the HTTP server
// ------------------------------------------------------------------
const server = app.listen(PORT, async () => {
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`🚀  Server running on http://localhost:${PORT}`);
  console.log(`📡  Contact API  →  POST http://localhost:${PORT}/api/contact`);
  console.log(`💚  Health Check →  GET  http://localhost:${PORT}/api/health`);
  console.log('══════════════════════════════════════════════════');
  console.log('');

  // Verify that the mail transporter can authenticate
  await verifyTransporter();
});

// ------------------------------------------------------------------
// 12. Graceful shutdown
// ------------------------------------------------------------------
// When the process receives SIGTERM (e.g., Render stopping the
// service) or SIGINT (Ctrl+C), close open connections cleanly
// before exiting.

const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅  HTTP server closed. Goodbye!');
    process.exit(0);
  });

  // Force-kill after 10 seconds if connections are stuck
  setTimeout(() => {
    console.error('❌  Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
