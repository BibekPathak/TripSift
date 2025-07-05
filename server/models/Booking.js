const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
  provider: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'confirmed' },
  estimatedArrival: { type: Date },
  driverDetails: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 