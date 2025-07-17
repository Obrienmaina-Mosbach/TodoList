// server/api/index.js
// This file acts as the entry point for your Vercel Serverless Function.
// It wraps your Express app using serverless-http.

const serverless = require('serverless-http');
const createExpressApp = require('../server'); // Import the function that creates your Express app

const expressApp = createExpressApp(); // Create an instance of your Express app

// Wrap the Express app with serverless-http
// This allows your Express app to handle requests in a serverless environment.
module.exports = serverless(expressApp);
