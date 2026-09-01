// ================================================================
// api/health.js — Vercel Serverless Health Endpoint
// ================================================================
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  res.status(200).json({
    success: true,
    message: 'Vercel Serverless Contact API is healthy.',
    timestamp: new Date().toISOString(),
  });
};

