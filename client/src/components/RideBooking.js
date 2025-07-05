import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PriceCard from './PriceCard';
import { AuthContext } from '../context/AuthContext';
import { Autocomplete } from '@react-google-maps/api';
import './RideBooking.css';

const RideBooking = ({ onBookingComplete }) => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    pickup: '',
    destination: ''
  });
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Refs for Autocomplete
  const pickupRef = useRef();
  const destinationRef = useRef();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceChanged = (name, ref) => {
    const place = ref.current.getPlace();
    if (place && place.formatted_address) {
      setFormData(prev => ({ ...prev, [name]: place.formatted_address }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pickup || !formData.destination) {
      setError('Please enter both pickup and destination locations');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/rides/prices', {
        pickup: formData.pickup,
        destination: formData.destination
      });

      setPrices(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (provider, price) => {
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    
    try {
      const response = await axios.post('/api/rides/book', {
        pickup: formData.pickup,
        destination: formData.destination,
        provider: provider,
        price: price
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onBookingComplete(response.data.booking);
      navigate('/confirmation');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('You are not authorized. Please log in again.');
      } else {
        setError(err.response?.data?.error || 'Failed to book ride. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero-section">
        <h1>Find the Cheapest Ride</h1>
        <p>Compare prices from Uber, Ola, and Rapido to get the best deal for your journey</p>
      </div>

      <div className="booking-form">
        {!user && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3>Login Required</h3>
            <p>You must <span style={{ color: '#667eea', cursor: 'pointer' }} onClick={() => navigate('/login')}>login</span> or <span style={{ color: '#667eea', cursor: 'pointer' }} onClick={() => navigate('/register')}>register</span> to book a ride.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="card">
          <h2>Where would you like to go?</h2>
          
          <div className="input-group">
            <label htmlFor="pickup">Pickup Location</label>
            <Autocomplete
              onLoad={ref => (pickupRef.current = ref)}
              onPlaceChanged={() => handlePlaceChanged('pickup', pickupRef)}
            >
              <input
                type="text"
                id="pickup"
                name="pickup"
                value={formData.pickup}
                onChange={e => handleInputChange('pickup', e.target.value)}
                placeholder="Enter your pickup location"
                className="location-search-input"
                autoComplete="off"
                disabled={loading}
              />
            </Autocomplete>
          </div>

          <div className="input-group">
            <label htmlFor="destination">Destination</label>
            <Autocomplete
              onLoad={ref => (destinationRef.current = ref)}
              onPlaceChanged={() => handlePlaceChanged('destination', destinationRef)}
            >
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={e => handleInputChange('destination', e.target.value)}
                placeholder="Enter your destination"
                className="location-search-input"
                autoComplete="off"
                disabled={loading}
              />
            </Autocomplete>
          </div>

          {error && <div className="error">{error}</div>}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Calculating Prices...' : 'Find Prices'}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {prices && !loading && (
          <div className="prices-section">
            <div className="card">
              <h3>Ride Options</h3>
              <p className="distance-info">
                Distance: {prices.distance} km • 
                Cheapest: {prices.cheapest.name} at ₹{prices.cheapest.price}
              </p>
            </div>

            <div className="price-cards">
              {prices.prices.map((price, index) => (
                <PriceCard
                  key={price.provider}
                  price={price}
                  isCheapest={index === 0}
                  onBook={() => handleBookRide(price.provider, price.price)}
                  loading={loading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideBooking; 