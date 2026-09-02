// ================================================================
// middleware/rateLimiter.js — Rate Limiting Configuration
// ================================================================
// Prevents abuse / spam by limiting how many requests a single
// IP address can make to the contact endpoint within a time
// window.
//
// Supports two modes:
//   1. Distributed Rate Limiting via Upstash Redis (@upstash/ratelimit)
//      when UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN are set.
//   2. Local MemoryStore fallback (express-rate-limit) for local dev.
// ================================================================

const rateLimit = require('express-rate-limit');

/**
 * Global rate limiter for Express server deployments.
 * Allows 100 requests per 15 minutes from a single IP across all endpoints.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
});

/**
 * Local MemoryStore fallback limiter for contact form (5 requests per 15 min).
 */
const localMemoryContactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please try again after 15 minutes.',
  },
});

// Lazy-initialized singleton for Upstash Ratelimit
let upstashRatelimit = null;

const getUpstashRatelimit = () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  if (!upstashRatelimit) {
    try {
      const { Redis } = require('@upstash/redis');
      const { Ratelimit } = require('@upstash/ratelimit');

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      upstashRatelimit = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        timeout: 1500, // library built-in 1500ms timeout
        analytics: true,
      });
    } catch (err) {
      console.warn('⚠️ Failed to initialize Upstash Ratelimit:', err.message);
      return null;
    }
  }

  return upstashRatelimit;
};

/**
 * Contact-specific rate limiter middleware.
 * Uses Upstash Redis distributed sliding window (5 requests / 10 min) in production,
 * and falls back to express-rate-limit MemoryStore in local dev.
 */
const contactLimiter = async (req, res, next) => {
  const ratelimit = getUpstashRatelimit();

  if (ratelimit) {
    // Extract Vercel trusted client IP with safe fallbacks
    const clientIp =
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    try {
      const { success } = await ratelimit.limit(clientIp);

      if (!success) {
        return res.status(429).json({
          success: false,
          message: 'Too many messages sent. Please try again after 10 minutes.',
        });
      }

      return next();
    } catch (err) {
      // Fail open on network failure or timeout
      console.warn('⚠️ Upstash Rate Limiter error, failing open:', err.message);
      return next();
    }
  }

  // Fallback to local MemoryStore limiter for local development
  return localMemoryContactLimiter(req, res, next);
};

module.exports = { globalLimiter, contactLimiter };
