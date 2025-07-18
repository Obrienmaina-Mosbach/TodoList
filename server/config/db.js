// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGO_URI prefix:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 40) + '...' : 'ERROR: MONGO_URI environment variable is NOT SET');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true, // Can remove
      // useUnifiedTopology: true, // Can remove
    });

    if (conn && conn.connection && conn.connection.host) {
      console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
    } else {
      console.log('WARNING: MongoDB connection object received, but host is undefined or connection incomplete.');
      console.log('Full Mongoose connection object (for debug):', JSON.stringify(conn, null, 2));
    }
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error caught in connectDB: ${error.message}`);
    console.error('Full connection error object details:', error);
    throw error;
  }
};

module.exports = connectDB;