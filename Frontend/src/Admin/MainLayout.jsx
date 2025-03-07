import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the same directory
import ManageUser from "./Info Card/ManageUser";
import ManageBookings from "./Info Card/ManageBookings";
import ManageParking from "./Info Card/ManageParking";
import Activity from "./Activity";

const MainLayout = ({setShowLogin}) => {


  return (
    <div className="flex">
      <Sidebar setShowLogin={setShowLogin}/>
      <div className="flex-1 p-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card for Total Users */}
            <ManageUser/>

          {/* Card for Active Bookings */}
            <ManageBookings/>

          {/* Card for Total Parkings */}
            <ManageParking/>

          {/* Card for Recent Activity */}
          <Activity/>

          
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
