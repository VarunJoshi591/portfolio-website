// ================================================================
// controllers/contactController.js — Contact Form Business Logic
// ================================================================
// Handles the core workflow when a contact form is submitted:
//   1. Extract validated/sanitized fields from the request body.
//   2. Capture metadata (IP address, User-Agent, timestamp).
//   3. Send a notification email TO the portfolio owner.
//   4. Send a confirmation email TO the person who wrote in.
//   5. Return a JSON success/failure response.
//
// All email sending is done with async/await and wrapped in
// try/catch for robust error handling.
// ================================================================

const { transporter } = require('../config/mail');
const { notificationTemplate, confirmationTemplate } = require('../utils/emailTemplate');

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
        message: 'Server email credentials are not configured. Set EMAIL_USER and EMAIL_PASS in your environment.',
      });
    }

    // ----------------------------------------------------------
    // Capture request metadata for logging & email template
    // ----------------------------------------------------------
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'Unknown';

    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date().toISOString();

    // Log the submission to the console (useful for debugging and auditing)
    console.log('─────────────────────────────────────────');
    console.log('📩  New Contact Form Submission');
    console.log(`    Name      : ${name}`);
    console.log(`    Email     : ${email}`);
    console.log(`    Subject   : ${subject}`);
    console.log(`    IP        : ${ip}`);
    console.log(`    UA        : ${userAgent}`);
    console.log(`    Timestamp : ${timestamp}`);
    console.log('─────────────────────────────────────────');

    // ----------------------------------------------------------
    // 1. Notification email → sent TO the portfolio owner
    // ----------------------------------------------------------
    const notificationMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email, // So you can hit "Reply" and it goes to the sender
      subject: `New Portfolio Contact: ${subject}`,
      html: notificationTemplate({ name, email, subject, message, ip, userAgent }),
    };

    // ----------------------------------------------------------
    // 2. Confirmation email → auto-reply sent TO the sender
    // ----------------------------------------------------------
    const confirmationMailOptions = {
      from: `"Varun Joshi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thanks for contacting Varun Joshi',
      html: confirmationTemplate({ name }),
    };

    // ----------------------------------------------------------
    // Send both emails concurrently for speed
    // ----------------------------------------------------------
    await Promise.all([
      transporter.sendMail(notificationMailOptions),
      transporter.sendMail(confirmationMailOptions),
    ]);

    console.log('✅  Both emails sent successfully.');

    // ----------------------------------------------------------
    // Success response
    // ----------------------------------------------------------
    return res.status(200).json({
      success: true,
      message: 'Email sent successfully.',
    });

  } catch (error) {
    // ----------------------------------------------------------
    // Error handling
    // ----------------------------------------------------------
    console.error('❌  Email sending failed:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to send email. Please try again later.',
    });
  }
};

module.exports = { sendContactEmail };
