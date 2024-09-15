const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');  // Braintree routes
const shippingRoutes = require('./routes/shippingRoutes'); // Shipping routes
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:3000', ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl requests
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allows cookies and authentication tokens to be sent
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); // Payment routes (Braintree, etc.)
app.use('/api/shipping', shippingRoutes); // Shipping routes

// Error handling middleware (optional but useful for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
