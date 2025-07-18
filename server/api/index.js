// server/api/index.js
const serverless = require('serverless-http');
// CORRECTED PATH: Go up one level (from 'api' to 'server'), then find 'server.js'
const initializeApp = require('../server'); // Path to server.js (Node.js automatically looks for index.js or a file with the same name as the directory if not specified, but here 'server.js' is a file)

let cachedServerlessHandler = null;

// This is the Vercel serverless function entry point
module.exports = async (req, res) => {
  if (cachedServerlessHandler) {
    // If the handler is cached, just use it
    return cachedServerlessHandler(req, res);
  }

  try {
    // Await the initialization of the Express app, which includes DB connection
    const app = await initializeApp();
    // Wrap the initialized Express app with serverless-http
    cachedServerlessHandler = serverless(app);
    console.log('Vercel serverless handler initialized and cached.');
    return cachedServerlessHandler(req, res);
  } catch (error) {
    console.error('Failed to initialize serverless function:', error);
    // Respond with a 500 error if it initialization fails
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error: Could not initialize application.');
  }
};   