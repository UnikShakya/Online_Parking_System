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
import ForgetPassword from './Pages/ForgetPassword';
import ResetPassword from './Pages/ResetPassword';  // Import ResetPassword
import BookingForm from './Pages/BookingForm';
import Middleware from './Middleware/Middleware';

// import LandingPage from './Pages/LandingPage';

export const RecoveryContext = createContext();

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const location = useLocation();

    const handleFormSubmit = (formData) => {
        console.log(formData); // Log form data or perform any action you want
        // Do something with formData, like making an API call or saving it in state
    };
     // Handle close (to close the modal or form)
     const handleClose = () => {
        console.log("Closing the form");
        // Implement close functionality
    };

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
                {/* <Route path='/middleware' element={<Middleware />} /> */}
                <Route path='/forget-password' element={<ForgetPassword />} />
                <Route path='/middleware' element={<Middleware />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} /> 
                <Route path='/bookingform' element={<BookingForm onSubmit={handleFormSubmit} onClose={handleClose} />} /> 
            </Routes>
        </StoreProvider>
    );
}

export default App;
