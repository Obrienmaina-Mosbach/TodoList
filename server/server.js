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

// Enable CORS for all origins (for development and Azure Functions)
// In production, you should restrict this to your frontend's domain
app.use(cors());

// Mount routes
app.use('/api/todos', todoRoutes);

// Export the Express app instance
module.exports = app;

// For local development, you might still want to run the server directly.
// This block will only execute if server.js is run directly (e.g., 'node server.js')
// and not when imported by an Azure Function.
if (require.main === module) {
  const PORT = process.env.PORT || 5001; // Use 5001 as the default local port
  app.listen(PORT, () => {
    console.log(`Local Express Server running on port ${PORT}`);
  });
}
