// ================================================================
// api/health.js — Vercel Serverless Health Endpoint
// ================================================================
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vercel Serverless Contact API is healthy.',
    timestamp: new Date().toISOString(),
  });
};
