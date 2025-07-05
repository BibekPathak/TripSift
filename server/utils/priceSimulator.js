// Ride provider configurations
const RIDE_PROVIDERS = {
  uber: {
    name: 'Uber',
    baseFare: 37,
    perKmRate: 12,
    minFare: 50,
    maxSurge: 30,
    logo: '🚗',
    color: '#000000',
    description: 'Premium ride experience'
  },
  ola: {
    name: 'Ola',
    baseFare: 38,
    perKmRate: 11.8,
    minFare: 49,
    maxSurge: 29,
    logo: '🟡',
    color: '#FFC107',
    description: 'Affordable and reliable'
  },
  rapido: {
    name: 'Rapido',
    baseFare: 36,
    perKmRate: 11.5,
    minFare: 48,
    maxSurge: 28,
    logo: '🛵',
    color: '#FF5722',
    description: 'Fast and economical'
  }
};

/**
 * Simulate prices for all ride providers
 */
function simulatePrices(distanceKm) {
  const prices = [];
  
  Object.keys(RIDE_PROVIDERS).forEach(providerKey => {
    const provider = RIDE_PROVIDERS[providerKey];
    const price = calculateProviderPrice(provider, distanceKm);
    
    prices.push({
      provider: providerKey,
      name: provider.name,
      price: price,
      distance: distanceKm,
      estimatedTime: calculateEstimatedTime(distanceKm),
      logo: provider.logo,
      color: provider.color,
      description: provider.description
    });
  });
  
  // Sort by price (cheapest first)
  return prices.sort((a, b) => a.price - b.price);
}

/**
 * Calculate price for a specific provider
 */
function calculateProviderPrice(provider, distanceKm) {
  // Base calculation
  let price = provider.baseFare + (distanceKm * provider.perKmRate);
  
  // Add surge pricing based on time of day
  const surgeMultiplier = calculateSurgeMultiplier();
  price *= surgeMultiplier;
  
  // Add random surge
  const randomSurge = Math.random() * provider.maxSurge;
  price += randomSurge;
  
  // Add a small random offset to make the winner less predictable
  price += Math.random() * 10 - 5; // -5 to +5 INR

  // Ensure minimum fare
  price = Math.max(price, provider.minFare);
  
  return Math.round(price);
}

/**
 * Calculate surge multiplier based on time of day
 */
function calculateSurgeMultiplier() {
  const hour = new Date().getHours();
  
  if (hour >= 7 && hour <= 9) { // Morning rush
    return 1.2 + (Math.random() * 0.3);
  } else if (hour >= 17 && hour <= 19) { // Evening rush
    return 1.3 + (Math.random() * 0.4);
  } else if (hour >= 22 || hour <= 6) { // Late night
    return 1.1 + (Math.random() * 0.2);
  } else { // Normal hours
    return 1.0 + (Math.random() * 0.1);
  }
}

/**
 * Calculate estimated travel time
 */
function calculateEstimatedTime(distanceKm) {
  // Assume average speed of 25 km/h in city traffic
  const baseTime = (distanceKm / 25) * 60; // in minutes
  const trafficVariation = Math.random() * 10 - 5; // ±5 minutes
  return Math.round(baseTime + trafficVariation);
}

module.exports = {
  simulatePrices,
  RIDE_PROVIDERS
}; 