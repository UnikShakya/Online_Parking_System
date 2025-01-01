import React from "react";
import { FaSearch, FaChartBar, FaFolder, FaCar, FaFile, FaUsers, FaCogs } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-bodyColor text-white flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul className="space-y-4">
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaSearch />
            <span>Search</span>
          </li>
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaChartBar />
            <span>Activity</span>
          </li>
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaFolder />
            <span>Middleware</span>
          </li>
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaCar />
            <span>Parkings</span>
          </li>
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaFile />
            <span>Booking</span>
          </li>
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaUsers />
            <span>Users</span>
          </li>
          <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaCogs />
            <span>Services</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
