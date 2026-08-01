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
const { contactValidationRules, validate } = require('../middleware/validateInput');

// Controller
const { sendContactEmail } = require('../controllers/contactController');

/**
 * POST /api/contact
 *
 * Middleware pipeline:
 * 1. contactLimiter       — Block if IP has sent > 5 msgs in 15 min
 * 2. contactValidationRules — Run express-validator checks
 * 3. validate             — If validation failed, return 422
 * 4. sendContactEmail     — Send the emails and respond
 */
router.post(
  '/',
  contactLimiter,
  contactValidationRules,
  validate,
  sendContactEmail
);

module.exports = router;
