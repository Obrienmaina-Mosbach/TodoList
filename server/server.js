// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

// Load env vars
dotenv.config({ path: './.env' }); // Adjust path if .env is in root, otherwise it's in server/

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Body parser for raw JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Enable CORS for all origins (for development)
// In production, you should restrict this to your frontend's domain
app.use(cors());

// Mount routes
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
