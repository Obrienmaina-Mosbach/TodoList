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
  console.log('createExpressApp: Starting Express app creation.'); // Log for debugging
  const app = express();

  // Middleware
  app.use(express.json()); // Body parser for raw JSON
  app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Define the allowed origin (update with your frontend URL)
const allowedOrigins = [
  'https://todo-list-nine-vert-88.vercel.app',
  'https://todo-list-git-main-obrienmaina-mosbachs-projects.vercel.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Include if you need to send cookies or auth headers
}));

  // Mount routes
  app.use('/api/todos', todoRoutes);
  console.log('createExpressApp: Express app created and routes mounted.'); // Log for debugging
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
    console.log('Server.js module.exports: Cold start path initiated.'); // Log for debugging
    cachedDbConnection = await connectDB(); // Connect to DB and cache the connection
    console.log('Server.js module.exports: DB connection established.'); // Log for debugging
    cachedApp = createExpressApp(); // Create the Express app
    console.log('Server.js module.exports: Express app instance created.'); // Log for debugging
    return cachedApp;
  } catch (error) {
    console.error('Server.js module.exports: Failed to initialize Express app or connect to DB:', error);
    console.error('Server.js module.exports: Full error details:', error); // Log full error
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
