import React from "react";
import Navbar from "./Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
// import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";


function App() {
  return (
<>      {/* Navbar is outside of Routes because it should be displayed on all pages */}
        <Navbar/>
        {/* Define your routes */}
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/signup" element={<Signup/>} />
           {/* <Route path="/login" element={<Login />} /> */}
           <Route path="/signin" element={<Signin />} />
        </Routes>
        </>  
  );
}

export default App;
