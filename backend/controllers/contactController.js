// ================================================================
// controllers/contactController.js — Contact Form Business Logic
// ================================================================
// Handles the core workflow when a contact form is submitted:
//   1. Extract validated/sanitized fields from the request body.
//   2. Send a notification email TO the portfolio owner.
//   3. Return a JSON success/failure response.
//
// Privacy: IP and User-Agent are NOT collected or stored here.
// Rate limiting uses IP internally via its own middleware.
//
// All email sending is done with async/await and wrapped in
// try/catch for robust error handling.
// ================================================================

const { transporter } = require('../config/mail');
const { notificationTemplate } = require('../utils/emailTemplate');

/**
 * POST /api/contact
 *
 * Expects JSON body: { name, email, subject, message }
 * (Already validated and sanitized by middleware.)
 */
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Verify environment variables are present
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL_USER or EMAIL_PASS environment variables are missing!');
      return res.status(500).json({
        success: false,
        message: 'Unable to send email due to a server configuration issue. Please try again later.',
      });
    }

    // ----------------------------------------------------------
    // Log submission (privacy-safe: no IP or User-Agent)
    // ----------------------------------------------------------
    const timestamp = new Date().toISOString();

    console.log('─────────────────────────────────────────');
    console.log('📩  New Contact Form Submission');
    console.log(`    Name      : ${name}`);
    console.log(`    Email     : ${email}`);
    console.log(`    Subject   : ${subject}`);
    console.log(`    Timestamp : ${timestamp}`);
    console.log('─────────────────────────────────────────');

    // ----------------------------------------------------------
    // Notification email → sent ONLY to the portfolio owner
    // (Auto-reply removed to prevent arbitrary email relay abuse)
    // ----------------------------------------------------------
    const notificationMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email, // Raw validated email for direct replies
      subject: `New Portfolio Contact: ${subject}`,
      html: notificationTemplate({ name, email, subject, message }),
    };

    // Dispatch notification email
    await transporter.sendMail(notificationMailOptions);

    console.log('✅ Notification email sent successfully.');

    // ----------------------------------------------------------
    // Success response
    // ----------------------------------------------------------
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully.',
    });

  } catch (error) {
    // ----------------------------------------------------------
    // Error handling (full log server-side, generic msg client-side)
    // ----------------------------------------------------------
    console.error('❌ Email sending failed:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to send email. Please try again later.',
    });
  }
};

module.exports = { sendContactEmail };
