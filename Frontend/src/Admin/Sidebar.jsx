import { useState } from "react";
import { FaSearch, FaChartBar, FaFolder, FaCar, FaFile, FaUsers, FaCogs, FaHome } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";

const Sidebar = ({ setShowLogin }) => {
  const [isParkingOpen, setIsParkingOpen] = useState(false); // State to control Parking dropdown visibility

  const logout = () => {
    localStorage.removeItem("token");  // Remove the token on logout
    localStorage.removeItem("username");  // Remove the username on logout
    setShowLogin(true);  // Show the login popup again
  };

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

       {/* Parking Dropdown */}
       <li 
            className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer"
            onClick={() => setIsParkingOpen(!isParkingOpen)}  // Toggle dropdown visibility
          >
            <FaCar />
            <span>Parking &gt;</span>
          </li>
          <ul
            className={`space-y-2 pl-6 transition-all duration-300 ease-in-out overflow-hidden ${
              isParkingOpen ? 'h-auto' : 'h-0'
            }`}
            style={{
              transitionProperty: "height",
              transitionDuration: "300ms",
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
              <FaCar />
              <span>Parking Lot</span>
            </li>
            <li className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
              <FaDollarSign />
              <span>Parking Cost</span>
            </li>
          </ul>



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
          <li onClick={logout} className="flex items-center space-x-4 hover:bg-designColor p-2 rounded cursor-pointer">
            <FaHome />
            <span>Logout</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
