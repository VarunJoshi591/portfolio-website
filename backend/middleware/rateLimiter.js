// ================================================================
// middleware/rateLimiter.js — Rate Limiting Configuration
// ================================================================
// Prevents abuse / spam by limiting how many requests a single
// IP address can make to the contact endpoint within a time
// window.
//
// Two limiters are exported:
//   1. globalLimiter  — Loose limit applied to ALL routes.
//   2. contactLimiter — Strict limit applied ONLY to POST /api/contact.
// ================================================================

const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter.
 * Allows 100 requests per 15 minutes from a single IP across
 * all endpoints.  This is a safety net, not the primary guard.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,   // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,     // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Contact-specific rate limiter.
 * Allows only 5 contact-form submissions per 15 minutes from a
 * single IP.  This is the primary spam guard.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please try again after 15 minutes.',
  },
});

module.exports = { globalLimiter, contactLimiter };
