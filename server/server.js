// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connectDB function
const todoRoutes = require('./routes/todoRoutes');

// Load env vars for local development
dotenv.config({ path: './.env' });

// Function to create and configure the Express app
// This function will now handle the database connection internally
const createExpressApp = () => {
  const app = express();

  // Middleware
  app.use(express.json()); // Body parser for raw JSON
  app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

  // Enable CORS for specific origins (recommended for production)
  // Replace <YOUR_VERCEL_FRONTEND_DOMAIN> with your actual Vercel frontend domain.
  app.use(cors({
    origin: process.env.NODE_ENV === 'production'
      ? 'https://todo-list-obrienmaina-mosbachs-projects.vercel.app' // Ensure no trailing slash here
      : 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Mount routes
  // The vercel.json routes /api/(.*) to this function, and serverless-http
  // will pass the full path. So, Express needs to handle /api/todos directly.
  app.use('/api/todos', todoRoutes);

  return app;
};

// Export an async function that connects to DB and then returns the Express app
// This ensures DB connection is established before the app starts processing requests.
// This is crucial for serverless functions.
let cachedApp = null;
let cachedDbConnection = null;

module.exports = async () => {
  if (cachedApp && cachedDbConnection) {
    console.log('Using cached app and DB connection.');
    return cachedApp;
  }

  try {
    cachedDbConnection = await connectDB(); // Connect to DB and cache the connection
    cachedApp = createExpressApp(); // Create the Express app
    return cachedApp;
  } catch (error) {
    console.error('Failed to initialize Express app or connect to DB:', error);
    // In a serverless environment, re-throw or handle error gracefully
    // instead of process.exit(1) which might not log effectively.
    throw error; 
  }


  
};





// For local development, you might still want to run the server directly.
if (require.main === module) {
  (async () => {
    try {
      const app = createExpressApp(); // Create app for local use
      await connectDB(); // Connect DB for local use
      const PORT = process.env.PORT || 5001; // Use 5001 as the default local port
      app.listen(PORT, () => {
        console.log(`Local Express Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Local server failed to start:', error);
      process.exit(1);
    }
  })(); //rolling back
}
