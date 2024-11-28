const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const studentRoutes = require('./routes/studentRoutes');
const errorMiddleware = require('./middleware/errorHandler'); // Make sure to import this as well

dotenv.config();
const app = express();

// Basic CORS setup
const allowedOrigins = [
  'http://localhost:3000',  // Development
  'https://uncommonprogresstrack.netlify.app',
  'capacitor://localhost',  // For mobile apps using Capacitor
  'ionic://localhost',      // For Ionic apps
  'exp://localhost:19000',  // For Expo development
  '*'                       // Allow all mobile app origins
];

app.use(cors({
  origin: function(origin, callback) {
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


// Database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// Define routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/institution', institutionRoutes);  // Corrected here

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
