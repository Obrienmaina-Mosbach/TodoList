    // server/api/index.js
    // This file acts as the entry point for your Vercel Serverless Function.
    // It wraps your Express app using serverless-http.

    const serverless = require('serverless-http');
    const getExpressApp = require('../server'); // Import the async function that gets the Express app

    let cachedHandler = null;

    // This is the Vercel serverless function handler
    module.exports = async (req, res) => {
      if (!cachedHandler) {
        const expressApp = await getExpressApp(); // Await the Express app instance
        cachedHandler = serverless(expressApp);
      }
      return cachedHandler(req, res);
    };
    