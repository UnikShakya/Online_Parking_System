import React from "react";
import Sidebar from "./Sidebar"; // Assuming Sidebar is in the same directory

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card for Total Parkings */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Parkings</h3>
            <p className="text-2xl">150</p>
          </div>

          {/* Card for Active Bookings */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Active Bookings</h3>
            <p className="text-2xl">75</p>
          </div>

          {/* Card for Total Users */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl">300</p>
          </div>

          {/* Card for Recent Activity */}
          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <ul className="space-y-2">
              <li>User John Doe booked a parking spot.</li>
              <li>User Jane Smith canceled a booking.</li>
              <li>User Mike Johnson added a new vehicle.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;