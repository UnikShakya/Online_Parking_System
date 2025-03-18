import React, { useState, createContext, useEffect } from 'react';
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
import Middleware from './Middleware/Table';
import Booking from './Admin/Booking';
import Home from './Pages/Home';
import TravelForm from './Components/Calendar';
import Stepper from './Components/Stepper';
import Settings from './Admin/Settings';
// import Booking from './Admin/Booking';
// import { ParkingProvider } from './Context/ParkingContext';

// import LandingPage from './Pages/LandingPage';

export const RecoveryContext = createContext();

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const location = useLocation();

    useEffect(() => {
        localStorage.clear(); // Clears all items in localStorage when App component mounts
      }, []); // Empty dependency array ensures this only runs once when the app loads
    

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
            {/* <ParkingProvider> */}
            <ToastContainer />
            {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/middleware') && <Navbar setShowLogin={setShowLogin} />}
            {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

            <Routes>
                <Route path="/" element={<Home setShowLogin={setShowLogin} />} />
                <Route path="/pagination" element={<Stepper/>} />
                <Route path="/parking-lot" element={<ParkingLot />} />
                <Route path='/booking-ticket' element={<BookingTicket />} />
                {/* <Route path='/middleware' element={<Middleware />} /> */}
                <Route path='/forget-password' element={<ForgetPassword />} />
                <Route path='/middleware' element={<Middleware />} />
                <Route path='/calendar' element={<TravelForm />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
                <Route path='/bookingform' element={<BookingForm onSubmit={handleFormSubmit} onClose={handleClose} />} />
                {/* <Route path='/booking' element={<Booking />} /> */}
                {/*Admin Route */}
                <Route path="/admin" element={<MainLayout setShowLogin={setShowLogin} />} >
                {/* Nested routes for admin dashboard */}
                <Route path="booking" element={<Booking />} />
                <Route path="settings" element={<Settings />} />
                </Route>


            </Routes>
            {/* </ParkingProvider> */}
        </StoreProvider>
    );
}

export default App;
