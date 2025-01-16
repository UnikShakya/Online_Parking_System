import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';  // Import useLocation
import Navbar from './Components/Navbar';
import LoginPopup from './LoginPopup';
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from './Context/StoreContext'; 
import MainLayout from './Admin/MainLayout';
import Selection from './Components/Selection';
import ParkingLot from './Pages/ParkingLot';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();  // Get current route

  return (
    <StoreProvider> {/* Context Provider for global state */}
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      
      {/* Conditionally render Navbar based on the current route */}
      {location.pathname !== '/admin' && <Navbar setShowLogin={setShowLogin} />}

      <Routes>
      <Route path="/" element={<Selection />} />
        <Route path="/admin" element={<MainLayout />} />
        <Route path="/parking-lot" element={<ParkingLot />} />
      </Routes>
    </StoreProvider>
  );
}

export default App;
