const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const studentRoutes = require('./routes/studentRoutes');
const errorMiddleware = require('./middleware/errorHandler'); // Import your error handling middleware

// Load environment variables from .env file
dotenv.config();
const app = express();

// Define allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', 'https://uncommonprogresstrack.netlify.app','http://localhost:3001', '*' ]; // Add your frontend URL(s) here

// Basic CORS setup
app.use(cors({
  origin: function(origin, callback) {
    console.log('Request Origin:', origin); // Log the origin
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Allow if origin is in whitelist or origin is undefined
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));  // Serve images from 'uploads' folder

// Database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit process if database connection fails
  });

// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/institution', institutionRoutes);  // Ensure this route is correctly defined

// Error handling middleware should be placed after all routes
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for testing or further configuration
module.exports = app;
