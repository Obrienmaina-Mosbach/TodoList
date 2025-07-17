// server/api/index.js
// This file acts as the entry point for your Azure Function
// It imports your Express app and uses it to handle HTTP requests.

const app = require('../server'); // Import your Express app from server.js
const createHandler = require('azure-function-express').createHandler;

// This is the main entry point for the Azure Function.
// It creates an Azure Function handler that routes HTTP requests to your Express app.
module.exports = createHandler(app);
