/**
 * Create a mock booking for a ride
 */
function createBooking(pickup, destination, provider, price) {
  const bookingId = generateBookingId();
  const estimatedArrival = calculateEstimatedArrival();
  
  const booking = {
    id: bookingId,
    pickup: pickup,
    destination: destination,
    provider: provider,
    price: price,
    status: 'confirmed',
    estimatedArrival: estimatedArrival,
    driverDetails: generateDriverDetails(),
    createdAt: new Date().toISOString(),
    paymentMethod: 'Cash',
    distance: null, // Will be calculated by frontend
    estimatedTime: null // Will be calculated by frontend
  };
  
  // In a real app, you would save this to a database
  console.log('Booking created:', booking);
  
  return booking;
}

/**
 * Generate a unique booking ID
 */
function generateBookingId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BK${timestamp}${random}`.toUpperCase();
}

/**
 * Calculate estimated arrival time
 */
function calculateEstimatedArrival() {
  // Driver arrives in 3-8 minutes
  const arrivalMinutes = Math.floor(Math.random() * 5) + 3;
  const arrivalTime = new Date(Date.now() + arrivalMinutes * 60000);
  return arrivalTime.toISOString();
}

/**
 * Generate mock driver details
 */
function generateDriverDetails() {
  const driverNames = [
    'Rajesh Kumar', 'Amit Singh', 'Suresh Patel', 'Vikram Sharma',
    'Mohan Das', 'Ramesh Gupta', 'Prakash Verma', 'Anil Kumar'
  ];
  
  const carModels = [
    'Swift Dzire', 'Honda City', 'Maruti Suzuki', 'Hyundai i10',
    'Tata Indica', 'Mahindra Logan', 'Ford Figo', 'Chevrolet Beat'
  ];
  
  return {
    name: driverNames[Math.floor(Math.random() * driverNames.length)],
    phone: '+91' + Math.floor(Math.random() * 9000000000) + 1000000000,
    carModel: carModels[Math.floor(Math.random() * carModels.length)],
    carNumber: generateCarNumber(),
    rating: (4 + Math.random()).toFixed(1),
    photo: null // In real app, this would be a URL
  };
}

/**
 * Generate a mock car number
 */
function generateCarNumber() {
  const states = ['DL', 'MH', 'KA', 'TN', 'AP', 'TG', 'KL', 'GJ'];
  const state = states[Math.floor(Math.random() * states.length)];
  const number = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const letters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                  String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const finalNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${state}${number}${letters}${finalNumber}`;
}

/**
 * Get booking status updates
 */
function getBookingStatus(bookingId) {
  // Mock status updates
  const statuses = ['confirmed', 'driver_assigned', 'driver_arriving', 'in_progress', 'completed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    bookingId: bookingId,
    status: randomStatus,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  createBooking,
  getBookingStatus
}; 