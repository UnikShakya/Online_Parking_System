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
// import Profile from './Pages/Profile';
import ProfileLayout from './Pages/Profile/ProfileLayout';
import UpcomingBookings from './Pages/Profile/UpcomingBookings';
import BookingHistory from './Pages/Profile/BookingHistory';
// import ProfileOverview from './Pages/Profile/ProfileOverview';
import UserSettings from './Pages/Profile/UserSettings';
import UserDashboard from './Pages/Profile/UserDashboard';
import PatanMainLayout from './Middleman/Patan/PatanMainLayout';
import BhaktapurMainLayout from './Middleman/Bhaktapur/BhaktapurMainLayout';
import PatanTable from './Middleman/Patan/PatanTable';
import PatanParkingLot from './Middleman/Patan/PatanParkingLot';
import PatanMiddlemen from './Middleman/Patan/PatanMiddlemen';
import BhaktapurTable from './Middleman/Bhaktapur/BhaktapurTable';
import BhaktapurParkingLot from './Middleman/Bhaktapur/BhaktapurParkingLot';
import BhaktapurMiddlemen from './Middleman/Bhaktapur/BhaktapurMiddlemen';
import BouddhaMainLayout from './Middleman/Bouddha/BouddhaMainLayout';
import BouddhaTable from './Middleman/Bouddha/BouddhaTable';
import BouddhaParkingLot from './Middleman/Bouddha/BouddhaParkingLot';
import BouddhaMiddlemen from './Middleman/Bouddha/BouddhaMiddlemen';


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

  // const handleClose = () => {
  //   console.log("Closing the form");
  // };


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
          {/* <Route path="/middleman/:id" element={<Table/>} /> */}
          {/* <Route path="/profile" element={<Profile/>} /> */}
          <Route path="/calendar" element={<TravelForm />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/bookingform" element={<BookingForm onSubmit={handleFormSubmit}/>} />

          <Route path="/profile" element={<ProfileLayout setShowLogin={setShowLogin} />}>
  {/* <Route index element={<ProfileOverview />} /> */}
  <Route index element={<UserDashboard />} />
  <Route path="upcoming" element={<UpcomingBookings />} />
  <Route path="history" element={<BookingHistory />} />
  <Route path="settings" element={<UserSettings />} />
</Route>


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

    <Route path="/middleman/patan/:id" element={<PatanMainLayout setShowLogin={setShowLogin} />}>
    <Route index element={<PatanTable />} />
    <Route path="parkinglot" element={<PatanParkingLot/>} />
    <Route path="middleman" element={<PatanMiddlemen/>} />
    </Route>

    <Route path="/middleman/bhaktapur/:id" element={<BhaktapurMainLayout setShowLogin={setShowLogin}/>}>
    <Route index element={<BhaktapurTable/>}/>
    <Route path="parkinglot" element={<BhaktapurParkingLot/>}/>
    <Route path="middleman" element={<BhaktapurMiddlemen/>}/>
    </Route>

    <Route path="/middleman/bouddha/:id" element={<BouddhaMainLayout setShowLogin={setShowLogin}/>}>
    <Route index element={<BouddhaTable/>}/>
    <Route path="parkinglot" element={<BouddhaParkingLot/>}/>
    <Route path="middleman" element={<BouddhaMiddlemen/>}/>
    </Route>

        </Routes>
      </ParkingCostProvider>
    </StoreProvider>
  );
}

export default App;
