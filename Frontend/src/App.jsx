import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginPopup from './LoginPopup';
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from './Context/StoreContext';
import MainLayout from './Admin/MainLayout';
import BookingTicket from './Pages/BookingTicket';
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';
import BookingForm from './Pages/BookingForm';
import Middleware from './Middleman/Table';
import Booking from './Admin/Booking';
import Home from './Pages/Home';
import TravelForm from './Components/Calendar';
import Stepper from './Components/Stepper';
import Settings from './Admin/Settings';
import Dashboard from './Admin/Dashboard';
import Middleman from './Admin/Middleman';
import Users from './Admin/Users';
import ParkingCost from './Admin/ParkingCost';
import ParkingLots from './Admin/ParkingLots';
import ParkingLotWrapper from './Pages/ParkingLotWrapper';
import { ParkingCostProvider } from './Context/ParkingCostContext';

export const RecoveryContext = createContext();

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // localStorage.removeItem("token");
  }, []);

  const handleFormSubmit = (formData) => {
    console.log(formData);
  };

  const handleClose = () => {
    console.log("Closing the form");
  };

  return (
    <StoreProvider>
      <ParkingCostProvider>
        <ToastContainer />
        {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/middleman') && (
          <Navbar setShowLogin={setShowLogin} />
        )}
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

        <Routes>
          <Route path="/" element={<Home setShowLogin={setShowLogin} />} />
          <Route path="/pagination" element={<Stepper />} />
          <Route path="/parking-lot" element={<ParkingLotWrapper />} />
          <Route path="/booking-ticket" element={<BookingTicket />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/middleman/:id" element={<Middleware />} />
          <Route path="/calendar" element={<TravelForm />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/bookingform" element={<BookingForm onSubmit={handleFormSubmit} onClose={handleClose} />} />

  {/* Admin Route for /admin/:id with nested routes */}
  <Route path="/admin/:id" element={<MainLayout setShowLogin={setShowLogin} />}>
    <Route index element={<Dashboard />} />
    <Route path="booking" element={<Booking />} />
    <Route path="middleman" element={<Middleman />} />
    <Route path="users" element={<Users />} />
    <Route path="parkingcost" element={<ParkingCost />} />
    <Route path="parkinglot" element={<ParkingLots />} />
    <Route path="settings" element={<Settings />} />
  </Route>

        </Routes>
      </ParkingCostProvider>
    </StoreProvider>
  );
}

export default App;
