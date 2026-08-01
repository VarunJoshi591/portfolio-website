// ================================================================
// middleware/validateInput.js — Input Validation & Sanitization
// ================================================================
// Uses express-validator to:
//   - Require all fields (name, email, subject, message).
//   - Validate email format.
//   - Enforce min/max lengths.
//   - Sanitize (trim, escape) to prevent XSS.
//   - Return structured JSON error responses.
// ================================================================

const { body, validationResult } = require('express-validator');

/**
 * Validation rules for the contact form payload.
 * Each rule chain trims whitespace, checks length, and escapes
 * HTML entities to neutralize XSS payloads.
 */
const contactValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ min: 2, max: 200 }).withMessage('Subject must be between 2 and 200 characters.')
    .escape(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters.'),
];

/**
 * Middleware that runs AFTER the validation rules.
 * If any rule failed, respond immediately with 422 and the
 * array of error messages — the request never reaches the
 * controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Extract only the human-readable messages
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: extractedErrors,
    });
  }

  next();
};

module.exports = { contactValidationRules, validate };
