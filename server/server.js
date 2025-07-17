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
  // For Vercel, you'll need to specify your frontend's deployed domain.
  // During development, 'http://localhost:8080' is needed.
  // Vercel often proxies /api calls, so this might be less critical if frontend and backend are in the same Vercel project.
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://<YOUR_VERCEL_FRONTEND_DOMAIN>' : 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Mount routes
  // Routes should start from /todos, as Vercel will route /api/* to this function.
  app.use('/todos', todoRoutes);

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
