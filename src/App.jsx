import React from "react";
import Navbar from "./Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
// import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import AdminPanel from "./Admin/AdminPanel";
import Selection from "./Components/Selection";


function App() {

const loaction =  useLocation();

const hideNavbarRoutes = ["/signup", "/signin", "/admin-panel"]

  return (
<>      {/* Navbar is outside of Routes because it should be displayed on all pages */}
       {!hideNavbarRoutes.includes(location.pathname) && <Navbar/>} 
        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Selection />} />
           <Route path="/signup" element={<Signup/>} />
           {/* <Route path="/login" element={<Login />} /> */}
           <Route path="/signin" element={<Signin />} />
           <Route path="/admin-panel" element={<AdminPanel/>} />
        </Routes>
        </>  
  );
}

export default App;
