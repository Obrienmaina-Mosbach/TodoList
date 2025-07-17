// server/api/index.js
// This file acts as the entry point for your Vercel Serverless Function.
// It wraps your Express app using serverless-http.

const serverless = require('serverless-http');
const createExpressApp = require('../server'); // Import the function that creates your Express app

// The createExpressApp function should be called ONLY ONCE
// to initialize the Express app and its routes.
const expressApp = createExpressApp(); 

// Wrap the Express app with serverless-http.
// This creates a handler that Vercel can invoke for incoming requests.
module.exports = serverless(expressApp);
