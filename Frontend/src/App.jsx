import React, { useState, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginPopup from './LoginPopup';
import { ToastContainer } from 'react-toastify';
import { StoreProvider } from './Context/StoreContext';
import MainLayout from './Admin/MainLayout';
import Selection from './Components/Selection';
import ParkingLot from './Pages/ParkingLot';
import BookingTicket from './Pages/BookingTicket';
import Middleware from './Middleware';
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';  // Import ResetPassword

export const RecoveryContext = createContext();

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const location = useLocation();

    return (
        <StoreProvider>
            <ToastContainer />
            {location.pathname !== '/admin' && <Navbar setShowLogin={setShowLogin} />}
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

            <Routes>
                <Route path="/" element={<Selection />} />
                <Route path="/admin" element={<MainLayout setShowLogin={setShowLogin} />} />
                <Route path="/parking-lot" element={<><Selection /><ParkingLot /></>} />
                <Route path='/booking-ticket' element={<BookingTicket />} />
                <Route path='/middleware' element={<Middleware />} />
                <Route path='/forget-password' element={<ForgetPassword />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} /> {/* Define the reset password route */}
            </Routes>
        </StoreProvider>
    );
}

export default App;
