const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { calculateDistance } = require('./utils/distanceCalculator');
const { simulatePrices } = require('./utils/priceSimulator');
const { createBooking } = require('./utils/bookingService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const Booking = require('./models/Booking');

dotenv.config();
console.log('Loaded GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword });
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// JWT auth middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader); // Debug: log the header
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  console.log('Token received:', token); // Debug: log the token
  if (!token) return res.status(401).json({ error: 'Invalid token format' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Ride Aggregator API is running' });
});

// Get ride prices
app.post('/api/rides/prices', async (req, res) => {
  try {
    const { pickup, destination } = req.body;
    
    if (!pickup || !destination) {
      return res.status(400).json({ 
        error: 'Pickup and destination locations are required' 
      });
    }

    // Calculate distance using Google Maps API
    const distance = await calculateDistance(pickup, destination);
    
    // Simulate prices for different providers
    const prices = simulatePrices(distance);
    
    res.json({
      distance: distance,
      prices: prices,
      cheapest: prices.reduce((min, price) => 
        price.price < min.price ? price : min
      )
    });
  } catch (error) {
    console.error('Error calculating prices:', error);
    res.status(500).json({ 
      error: 'Failed to calculate ride prices',
      details: error.message 
    });
  }
});

// Book a ride
app.post('/api/rides/book', authenticateJWT, async (req, res) => {
  try {
    const { pickup, destination, provider, price } = req.body;
    if (!pickup || !destination || !provider || !price) {
      return res.status(400).json({ error: 'Pickup, destination, provider, and price are required' });
    }
    const booking = await Booking.create({
      user: req.user.userId,
      pickup,
      destination,
      provider,
      price,
      status: 'confirmed',
      estimatedArrival: new Date(Date.now() + (Math.floor(Math.random() * 5) + 3) * 60000),
      driverDetails: require('./utils/bookingService').createBooking(pickup, destination, provider, price).driverDetails
    });
    res.json({ success: true, booking, message: `Ride booked successfully with ${provider}!` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to book ride', details: error.message });
  }
});

// Get booking history
app.get('/api/bookings', (req, res) => {
  try {
    // In a real app, this would fetch from database
    res.json({
      bookings: []
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: error.message 
    });
  }
});

// Get all bookings for the logged-in user
app.get('/api/my-bookings', authenticateJWT, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: error.message });
  }
});

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚗 Ride Aggregator Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
}); 