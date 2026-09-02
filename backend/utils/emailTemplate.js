// ================================================================
// utils/emailTemplate.js — HTML Email Templates
// ================================================================
// Generates beautifully styled HTML email bodies for:
//   1. The notification email sent TO the portfolio owner (you).
//   2. The auto-reply confirmation email sent TO the sender.
//
// Both templates include a timestamp so every email is traceable.
// ================================================================

/**
 * Helper to HTML-escape user-controlled content before rendering in HTML templates.
 */
const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Format a Date object into a human-readable string.
 * Example: "02 Aug 2026, 01:32 AM IST"
 */
const formatTimestamp = () => {
  return new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata',
  });
};

// ----------------------------------------------------------------
// 1.  NOTIFICATION EMAIL  →  Sent to joshivarun089@gmail.com
// ----------------------------------------------------------------
/**
 * @param {Object} data
 * @param {string} data.name    — Sender's name
 * @param {string} data.email   — Sender's email
 * @param {string} data.subject — Message subject
 * @param {string} data.message — Message body
 * @param {string} data.ip      — Sender's IP address
 * @param {string} data.userAgent — Sender's browser User-Agent
 * @returns {string} Complete HTML string
 */
const notificationTemplate = ({ name, email, subject, message, ip, userAgent }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const safeIp = escapeHtml(ip);
  const safeUserAgent = escapeHtml(userAgent);

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Form Submission</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;letter-spacing:0.5px;">
                  📬 New Portfolio Contact
                </h1>
                <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                  Someone reached out through your portfolio website
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px 40px;">

                <!-- Name -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:16px 20px;background:rgba(102,126,234,0.08);border-left:4px solid #667eea;border-radius:8px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#667eea;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Name</p>
                      <p style="margin:0;font-size:16px;color:#e0e0e0;font-weight:500;">${safeName}</p>
                    </td>
                  </tr>
                </table>

                <!-- Email -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:16px 20px;background:rgba(102,126,234,0.08);border-left:4px solid #667eea;border-radius:8px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#667eea;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Email</p>
                      <p style="margin:0;font-size:16px;color:#e0e0e0;">
                        <a href="mailto:${safeEmail}" style="color:#667eea;text-decoration:none;">${safeEmail}</a>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Subject -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:16px 20px;background:rgba(102,126,234,0.08);border-left:4px solid #667eea;border-radius:8px;">
                      <p style="margin:0 0 4px;font-size:12px;color:#667eea;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Subject</p>
                      <p style="margin:0;font-size:16px;color:#e0e0e0;font-weight:500;">${safeSubject}</p>
                    </td>
                  </tr>
                </table>

                <!-- Message -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:20px;background:rgba(102,126,234,0.05);border:1px solid rgba(102,126,234,0.15);border-radius:8px;">
                      <p style="margin:0 0 8px;font-size:12px;color:#667eea;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Message</p>
                      <p style="margin:0;font-size:15px;color:#d0d0d0;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
                    </td>
                  </tr>
                </table>

                <!-- Metadata: Timestamp, IP, User-Agent -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:16px 20px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06);">
                      <p style="margin:0 0 6px;font-size:12px;color:#888;">🕐 <strong>Timestamp:</strong> ${formatTimestamp()}</p>
                      <p style="margin:0 0 6px;font-size:12px;color:#888;">🌐 <strong>IP Address:</strong> ${safeIp || 'Unknown'}</p>
                      <p style="margin:0;font-size:12px;color:#888;">💻 <strong>User-Agent:</strong> ${safeUserAgent || 'Unknown'}</p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;font-size:12px;color:#666;">
                  This email was generated automatically by your portfolio contact form.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

// ----------------------------------------------------------------
// 2.  CONFIRMATION EMAIL  →  Auto-reply sent to the sender
// ----------------------------------------------------------------
/**
 * @param {Object} data
 * @param {string} data.name — Sender's name (used in greeting)
 * @returns {string} Complete HTML string
 */
const confirmationTemplate = ({ name }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Thanks for contacting Varun Joshi</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0f0f1a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px 40px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">
                  ✨ Thank You!
                </h1>
                <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                  Your message has been received
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <p style="margin:0 0 20px;font-size:17px;color:#e0e0e0;line-height:1.7;">
                  Hello <strong style="color:#667eea;">${name}</strong>,
                </p>
                <p style="margin:0 0 20px;font-size:15px;color:#c0c0c0;line-height:1.8;">
                  Thank you for contacting me through my portfolio website. I have received your message and truly appreciate you taking the time to reach out.
                </p>
                <p style="margin:0 0 20px;font-size:15px;color:#c0c0c0;line-height:1.8;">
                  I will review your message carefully and get back to you as soon as possible — usually within <strong style="color:#e0e0e0;">24–48 hours</strong>.
                </p>
                <p style="margin:0 0 24px;font-size:15px;color:#c0c0c0;line-height:1.8;">
                  In the meantime, feel free to explore my work:
                </p>

                <!-- CTA Button -->
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                  <tr>
                    <td style="border-radius:8px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);">
                      <a href="https://github.com/VarunJoshi591" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.5px;">
                        🚀 View My GitHub
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Sign-off -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
                      <p style="margin:0 0 4px;font-size:15px;color:#c0c0c0;">Warm regards,</p>
                      <p style="margin:0 0 4px;font-size:17px;color:#667eea;font-weight:700;">Varun Joshi</p>
                      <p style="margin:0;font-size:13px;color:#888;">M.Sc. Computer Science Student &amp; Aspiring Full-Stack Developer</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0 0 8px;font-size:12px;color:#666;">
                  This is an automated confirmation. Please do not reply to this email.
                </p>
                <p style="margin:0;font-size:12px;color:#555;">
                  © ${new Date().getFullYear()} Varun Joshi. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

module.exports = { notificationTemplate, confirmationTemplate };
