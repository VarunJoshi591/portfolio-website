// ================================================================
// routes/contactRoutes.js — Contact API Route Definitions
// ================================================================
// Wires the POST /api/contact endpoint together:
//   Rate Limiter  →  Validation Rules  →  Validate  →  Controller
//
// Each middleware runs in order; if any rejects the request, the
// chain stops and a JSON error is returned immediately.
// ================================================================

const express = require('express');
const router = express.Router();

// Middleware
const { contactLimiter } = require('../middleware/rateLimiter');
const { checkHoneypot } = require('../middleware/honeypot');
const { contactValidationRules, validate } = require('../middleware/validateInput');

// Controller
const { sendContactEmail } = require('../controllers/contactController');

/**
 * POST /api/contact
 *
 * Middleware pipeline:
 * 1. contactLimiter       — Block if IP has sent > 5 msgs in 15 min
 * 2. checkHoneypot        — Intercept bot submissions silently
 * 3. contactValidationRules — Run express-validator checks & CRLF rejection
 * 4. validate             — If validation failed, return 422
 * 5. sendContactEmail     — Send owner notification email
 */
router.post(
  '/',
  contactLimiter,
  checkHoneypot,
  contactValidationRules,
  validate,
  sendContactEmail
);

// Reject any unsupported HTTP method with 405 Method Not Allowed
router.all('/', (req, res) => {
  res.setHeader('Allow', 'POST, OPTIONS');
  return res.status(405).json({
    success: false,
    message: `Method ${req.method} Not Allowed. Only POST requests are accepted.`,
  });
});

module.exports = router;
