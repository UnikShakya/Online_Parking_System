import React, { useState } from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the same directory
import ManageUser from "./ManageUser";
import ManageBookings from "./ManageBookings";
import ManageParking from "./ManageParking";

const MainLayout = ({setShowLogin}) => {

const [recentActivities, setRecentActivites] = useState([]);

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
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3 hover:shadow-lg transform transition duration-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                User John Doe booked a parking spot.
              </li>
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                User Jane Smith canceled a booking.
              </li>
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                User Mike Johnson added a new vehicle.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
