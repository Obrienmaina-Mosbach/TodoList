// server/api/index.js
// This file acts as the entry point for your Vercel serverless function.

const serverless = require('serverless-http');
const createExpressApp = require('../server'); // Path to your server.js which exports createExpressApp

// Create an instance of your Express app
const app = createExpressApp();

// Wrap the Express app with serverless-http
module.exports = serverless(app);
