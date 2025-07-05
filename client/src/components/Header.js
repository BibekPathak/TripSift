import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">🚗</span>
            <span className="logo-text">TripSift</span>
          </Link>
          
          <nav className="nav">
            <Link to="/" className="nav-link">Book Ride</Link>
            <Link to="/confirmation" className="nav-link">My Bookings</Link>
            {!user && <Link to="/login" className="nav-link">Login</Link>}
            {!user && <Link to="/register" className="nav-link">Register</Link>}
            {user && <button className="nav-link btn btn-secondary" style={{ marginLeft: 8 }} onClick={handleLogout}>Logout</button>}
            <button className="nav-link btn btn-secondary" style={{ marginLeft: 8 }} onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 