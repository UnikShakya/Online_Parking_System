import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the same directory
import ManageUser from "./Info Card/ManageUser";
import ManageBookings from "./Info Card/ManageBookings";
import ManageParking from "./Info Card/ManageParking";
import Activity from "./Activity";
import PieChartComponent from "./PieChart";

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

          {/* Combined Activity and PieChart Section */}
          <div className="lg:col-span-3 flex flex-col lg:flex-row gap-6">
            {/* Recent Activity */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 w-full">
              <Activity />
            </div>

            {/* Pie Chart */}
            <div className="flex-1 p-6  w-full">
              <PieChartComponent />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
