// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config({ path: './.env' });

const createExpressApp = () => {
  console.log('createExpressApp: Starting Express app creation.'); // NEW LOG
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(cors({
    origin: '*', // Keep this as '*' for now to rule out CORS entirely
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use('/api/todos', todoRoutes);
  console.log('createExpressApp: Express app created and routes mounted.'); // NEW LOG
  return app;
};

let cachedApp = null;
let cachedDbConnection = null;

module.exports = async () => {
  if (cachedApp && cachedDbConnection) {
    console.log('Using cached app and DB connection.');
    return cachedApp;
  }

  try {
    console.log('Server.js module.exports: Cold start path initiated.'); // NEW LOG
    cachedDbConnection = await connectDB();
    console.log('Server.js module.exports: DB connection established.'); // NEW LOG
    cachedApp = createExpressApp(); // This is where Express app is actually created
    console.log('Server.js module.exports: Express app instance created.'); // NEW LOG
    return cachedApp;
  } catch (error) {
    console.error('Server.js module.exports: Failed to initialize Express app or connect to DB:', error);
    console.error('Server.js module.exports: Full error details:', error); // Log full error
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
