import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './BookingConfirmation.css';

const BookingConfirmation = ({ booking, onNewBooking }) => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.bookings);
      } catch (err) {
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container">
      <div className="confirmation-section">
        <h1>My Bookings</h1>
        {loading && <div className="loading"><div className="spinner"></div></div>}
        {error && <div className="error">{error}</div>}
        {!loading && bookings.length === 0 && (
          <div className="card">
            <h2>No Bookings Found</h2>
            <p>You don't have any active bookings.</p>
            <Link to="/" className="btn btn-primary">
              Book a New Ride
            </Link>
          </div>
        )}
        {!loading && bookings.length > 0 && (
          <div className="bookings-list">
            {bookings.map((b) => (
              <div className="card" key={b._id} style={{ marginBottom: 24 }}>
                <h2>{b.provider} - ₹{b.price}</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Pickup:</span>
                    <span className="detail-value">{b.pickup}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Destination:</span>
                    <span className="detail-value">{b.destination}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value status-confirmed">{b.status}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Booked on:</span>
                    <span className="detail-value">{formatDate(b.createdAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Arrival:</span>
                    <span className="detail-value">{formatTime(b.estimatedArrival)}</span>
                  </div>
                </div>
                {b.driverDetails && (
                  <div className="driver-details-text" style={{ marginTop: 12 }}>
                    <h3>Driver: {b.driverDetails.name}</h3>
                    <p className="driver-rating">⭐ {b.driverDetails.rating} Rating</p>
                    <p className="driver-car">{b.driverDetails.carModel}</p>
                    <p className="driver-number">{b.driverDetails.carNumber}</p>
                    <p className="driver-phone">{b.driverDetails.phone}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="action-buttons">
          <Link to="/" className="btn btn-primary">
            Book Another Ride
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 