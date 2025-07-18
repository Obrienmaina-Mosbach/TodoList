// server/api/index.js
const serverless = require('serverless-http');
const initializeApp = require('../server'); // Correct path to server.js

let cachedServerlessHandler = null;

module.exports = async (req, res) => {
  console.log('Serverless function invoked (full app initialization).');
  if (cachedServerlessHandler) {
    console.log('Using cached app and handler.');
    return cachedServerlessHandler(req, res);
  }

  try {
    console.log('Initializing new app and handler (cold start).');
    const app = await initializeApp(); // THIS IS THE CRITICAL AWAIT
    console.log('Express app returned from initializeApp.'); // NEW LOG
    cachedServerlessHandler = serverless(app);
    console.log('Vercel serverless handler initialized and cached.');
    return cachedServerlessHandler(req, res);
  } catch (error) {
    console.error('Failed to initialize serverless function or Express app:', error);
    console.error('Full initialization error details:', error); // Log full error
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal Server Error: Could not initialize application.');
  }
};