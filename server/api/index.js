// server/api/index.js
// This file acts as the entry point for your Vercel serverless function.

// Temporarily remove serverless-http and the Express app initialization
// to test if the serverless function itself is being invoked.

module.exports = async (req, res) => {
  console.log('Serverless function invoked (simplified test).');
  // Send a simple text response
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from Vercel Serverless Function!');
  console.log('Simple response sent.');
};
