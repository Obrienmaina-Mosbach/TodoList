// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Load env vars for local development
dotenv.config({ path: './.env' });

// Function to create and configure the Express app
const createExpressApp = () => {
  console.log('createExpressApp: Starting Express app creation.');
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Define the allowed origins
  const allowedOrigins = [
    'https://todo-list-nine-vert-88.vercel.app',
    'https://todo-list-git-main-obrienmaina-mosbachs-projects.vercel.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : null
  ].filter(Boolean);

  app.use(cors({
    origin: function (origin, callback) {
      // Log the origin for debugging
      console.log('Request origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Add error handling middleware
  app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    // Send appropriate status codes based on error type
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      res.status(503).json({
        message: 'Database service unavailable',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    } else {
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  });

  // Mount routes
  app.use('/api/todos', todoRoutes);
  console.log('createExpressApp: Express app created and routes mounted.');
  return app;
};

// Cache with timeout
let cachedApp = null;
let cachedDbConnection = null;
let lastConnectionTime = null;
const CACHE_TIMEOUT = 300000; // 5 minutes

module.exports = async () => {
  const now = Date.now();
  
  // Check if cache is still valid
  if (cachedApp && cachedDbConnection && lastConnectionTime && (now - lastConnectionTime < CACHE_TIMEOUT)) {
    console.log('Using cached app and DB connection.');
    return cachedApp;
  }

  try {
    console.log('Server.js: Cold start path initiated.');
    
    // Set timeout for MongoDB connection
    const connectionPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('DB Connection timeout')), 5000)
    );
    
    cachedDbConnection = await Promise.race([connectionPromise, timeoutPromise]);
    lastConnectionTime = Date.now();
    
    console.log('Server.js: DB connection established.');
    cachedApp = createExpressApp();
    console.log('Server.js: Express app instance created.');
    return cachedApp;
  } catch (error) {
    console.error('Server.js: Initialization error:', error);
    // Add specific error handling for connection timeouts
    if (error.message === 'DB Connection timeout') {
      throw new Error('Database connection timed out. Please try again.');
    }
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
