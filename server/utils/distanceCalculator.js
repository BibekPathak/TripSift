const axios = require('axios');

/**
 * Calculate distance between two locations using Google Maps API
 * Falls back to mock distance if API key is not provided
 */
async function calculateDistance(origin, destination) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.log('Google Maps API key not provided, using mock distance');
      return generateMockDistance();
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`
    );

    if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
      const distanceText = response.data.rows[0].elements[0].distance.text;
      const distanceKm = parseFloat(distanceText.replace(' km', ''));
      return distanceKm;
    } else {
      console.log('Google Maps API error, using mock distance');
      return generateMockDistance();
    }
  } catch (error) {
    console.error('Error calculating distance:', error.message);
    return generateMockDistance();
  }
}

/**
 * Generate a realistic mock distance for demo purposes
 */
function generateMockDistance() {
  // Generate distance between 2-30 km
  return Math.round((Math.random() * 28 + 2) * 10) / 10;
}

module.exports = {
  calculateDistance
}; 