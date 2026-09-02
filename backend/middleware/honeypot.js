// ================================================================
// middleware/honeypot.js — Bot Trap Anti-Spam Middleware
// ================================================================
// Inspects request body for invisible honeypot field (`hp_title`).
// If populated, silently intercepts the request, blocks SMTP dispatch,
// and returns a generic success response to trick spam bots.
// ================================================================

const checkHoneypot = (req, res, next) => {
  const honeypotValue = req.body?.hp_title;

  if (honeypotValue !== undefined && honeypotValue !== null && String(honeypotValue).trim() !== '') {
    // Bot submission trapped — log alert without exposing submitted message content
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'Unknown';
    console.warn(`🤖 Bot submission trapped and silently intercepted (IP: ${ip}).`);

    // Generic success response to prevent bots from learning trap behavior
    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
    });
  }

  next();
};

module.exports = { checkHoneypot };
