// server/api/index.js
// This file acts as the entry point for your Vercel Serverless Function.
// It wraps your Express app using serverless-http.

const serverless = require('serverless-http');
const createExpressApp = require('../server'); // Import the function that creates your Express app

const expressApp = createExpressApp(); // Create an instance of your Express app

// Wrap the Express app with serverless-http, specifying the base path.
// This tells serverless-http that all API requests will start with '/api'.
// This ensures Express correctly interprets the routes relative to '/api'.
module.exports = serverless(expressApp, {
  basePath: '/api' // CRITICAL: This tells serverless-http the base path for your API
});
