import React from 'react';
import './PriceCard.css';

const PriceCard = ({ price, isCheapest, onBook, loading }) => {
  return (
    <div className={`price-card ${isCheapest ? 'cheapest' : ''}`}>
      <div className="provider-info">
        <div className="provider-logo">{price.logo}</div>
        <div className="provider-details">
          <h3>{price.name}</h3>
          <p>{price.description}</p>
        </div>
      </div>

      <div className="price-display">
        <span className="price-amount">₹{price.price}</span>
        <span className="price-currency">INR</span>
      </div>

      <div className="ride-details">
        <div className="ride-detail">
          <div className="ride-detail-label">Distance</div>
          <div className="ride-detail-value">{price.distance} km</div>
        </div>
        <div className="ride-detail">
          <div className="ride-detail-label">Time</div>
          <div className="ride-detail-value">{price.estimatedTime} min</div>
        </div>
      </div>

      <button
        className={`book-button ${isCheapest ? 'primary' : 'secondary'}`}
        onClick={onBook}
        disabled={loading}
      >
        {loading ? 'Booking...' : isCheapest ? 'Book Now (Best Deal)' : 'Book Ride'}
      </button>
    </div>
  );
};

export default PriceCard; 