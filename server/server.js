// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Load env vars for local development
dotenv.config({ path: './.env' });

// Initialize and connect to database
connectDB();

// Function to create and configure the Express app
const createExpressApp = () => {
  const app = express();

  // Middleware
  app.use(express.json()); // Body parser for raw JSON
  app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

  // Enable CORS for all origins (for development and Azure Functions)
  app.use(cors());

  // Mount routes
  // The /api prefix will be handled by Azure Functions routing,
  // so Express routes should start from the root of the API path.
  app.use('/todos', todoRoutes); // Changed from '/api/todos' to '/todos'

  return app;
};

// Export the function that creates the Express app
module.exports = createExpressApp;

// For local development, you might still want to run the server directly.
// This block will only execute if server.js is run directly (e.g., 'node server.js')
// and not when imported by an Azure Function.
if (require.main === module) {
  const app = createExpressApp();
  const PORT = process.env.PORT || 5001; // Use 5001 as the default local port
  app.listen(PORT, () => {
    console.log(`Local Express Server running on port ${PORT}`);
  });
}
