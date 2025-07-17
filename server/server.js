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

  // Enable CORS for all origins (for development and Vercel)
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://<YOUR_VERCEL_FRONTEND_DOMAIN>' : 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // --- CRITICAL CHANGE FOR SERVERLESS ---
  // If running in a serverless environment, mount the API routes under /api
  // This handles cases where serverless-http might pass the full path.
  // Vercel's default behavior for functions at /api is often to strip /api,
  // but explicitly mounting it here ensures consistency.
  if (process.env.VERCEL) { // Vercel sets this environment variable
    app.use('/api/todos', todoRoutes); // Explicitly mount /api/todos for Vercel
  } else {
    app.use('/todos', todoRoutes); // For local development
  }
  // --- END CRITICAL CHANGE ---

  return app;
};

// Export the function that creates the Express app
module.exports = createExpressApp;

// For local development, you might still want to run the server directly.
if (require.main === module) {
  const app = createExpressApp();
  const PORT = process.env.PORT || 5001; // Use 5001 as the default local port
  app.listen(PORT, () => {
    console.log(`Local Express Server running on port ${PORT}`);
  });
}
