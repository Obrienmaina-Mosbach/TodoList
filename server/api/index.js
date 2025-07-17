// server/api/index.js
// This file acts as the entry point for your Vercel Serverless Function.
// It wraps your Express app using serverless-http.

const serverless = require('serverless-http');
const createExpressApp = require('../server'); // Import the function that creates your Express app

const expressApp = createExpressApp(); // Create an instance of your Express app

// Wrap the Express app with serverless-http.
// The basePath option is removed; we will handle routing in server.js more explicitly.
module.exports = serverless(expressApp);
