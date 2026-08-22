const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection test (runs the db.js code)
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const cityRoutes = require('./routes/city.routes');
const activityRoutes = require('./routes/activity.routes');
const budgetRoutes = require('./routes/budget.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/budgets', budgetRoutes);

// Base route for API status
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the GlobeTrotter API server.'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server.'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
