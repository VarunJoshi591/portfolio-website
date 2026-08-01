// ================================================================
// api/contact.js — Vercel Serverless Function Endpoint
// ================================================================
// Handles POST /api/contact when deployed on Vercel.
// Integrates Express, helmet, cors, input validation, rate limiting
// and Nodemailer email dispatching into a serverless handler.
// ================================================================

// Load environment variables if running locally via Vercel CLI
try {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });
} catch (e) {
  // Dotenv optional in production (Vercel provides process.env natively)
}

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const contactRoutes = require('../backend/routes/contactRoutes');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Trust Vercel proxy headers for rate limiting IP detection
app.set('trust proxy', 1);

// Mount Contact Routes
app.use('/api/contact', contactRoutes);
app.use('/contact', contactRoutes);

// Export for Vercel Serverless Function
module.exports = app;
