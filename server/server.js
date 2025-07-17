// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Load env vars
// For Azure Functions, environment variables are set directly in the portal.
// For local development, ensure .env is in the 'server' directory.
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for raw JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Enable CORS for specific origins (recommended for production)
// Replace <YOUR_VERCEL_FRONTEND_DOMAIN> with your actual Vercel frontend domain.
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://todo-list-nine-jade-67.vercel.app/' // e.g., 'https://todo-list-git-main-obrienmaina-mosbachs-projects.vercel.app'
    : 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Mount routes
// The vercel.json routes /api/(.*) to this function, and serverless-http
// will pass the full path. So, Express needs to handle /api/todos directly.
app.use('/api/todos', todoRoutes);

// Export the Express app instance
module.exports = app;

// For local development, you might still want to run the server directly.
// This block will only execute if server.js is run directly (e.g., 'node server.js')
// and not when imported by a serverless function.
if (require.main === module) {
  const PORT = process.env.PORT || 5001; // Use 5001 as the default local port
  app.listen(PORT, () => {
    console.log(`Local Express Server running on port ${PORT}`);
  });
}
