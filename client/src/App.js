import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RideBooking from './components/RideBooking';
import BookingConfirmation from './components/BookingConfirmation';
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadScript } from '@react-google-maps/api';
import './App.css';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // <-- Replace with your real key

function App() {
  const [currentBooking, setCurrentBooking] = useState(null);

  return (
    <ThemeProvider>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <AuthProvider>
          <Router>
            <div className="App">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <RideBooking 
                        onBookingComplete={setCurrentBooking}
                      />
                    } 
                  />
                  <Route 
                    path="/confirmation" 
                    element={
                      <BookingConfirmation 
                        booking={currentBooking}
                        onNewBooking={() => setCurrentBooking(null)}
                      />
                    } 
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </LoadScript>
    </ThemeProvider>
  );
}

export default App; 