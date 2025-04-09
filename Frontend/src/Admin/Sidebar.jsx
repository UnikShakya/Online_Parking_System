import { useState } from "react";
import { FaChartBar, FaFolder, FaCar, FaFile, FaUsers, FaCogs, FaHome, FaRupeeSign } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setShowLogin, id }) => {
  const [isParkingOpen, setIsParkingOpen] = useState(false); // State to control Parking dropdown visibility
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");  // Remove the token on logout
    localStorage.removeItem("username");  // Remove the username on logout
    setShowLogin(true);  // Show the login popup again
    navigate("/");
  };
    // Check what id contains
    console.log("Sidebar useParams id:", id);

    // Helper function to create paths with the token
    const adminPath = (path) => `/admin/${id}${path ? `/${path}` : ''}`;

  return (
    <aside className="h-screen w-64 bg-designColor text-white flex flex-col">
      {/* Logo Section */}
      <Link to={adminPath("")}>
        <div className="flex items-center justify-center py-6">
          <h1 className="text-2xl text-textColor font-bold cursor-pointer">
            <span className="text-gradientStart">P</span>ark<span className="text-gradientStart">E</span>ase
          </h1>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul className="my-2 space-y-3"> {/* Add space-y-3 for gap between top-level items */}
          {/* Dashboard */}
          <Link to={adminPath("")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaChartBar />
              <span>Dashboard</span>
            </li>
          </Link>

          {/* Middleman */}
          <Link to={adminPath("middleman")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaFolder />
              <span>Middleman</span>
            </li>
          </Link>

          {/* Parking Dropdown */}
          <li
            className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer"
            onClick={() => setIsParkingOpen(!isParkingOpen)}  // Toggle dropdown visibility
          >
            <FaCar />
            <span>Parking &gt;</span>
          </li>

          {/* Dropdown Items */}
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
            {/* Parking Lot */}
            <Link to={adminPath("parkinglot")}>
              <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                <FaCar />
                <span>Parking Lot</span>
              </li>
            </Link>

            {/* Parking Cost */}
            <Link to={adminPath("parkingcost")}>
              <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                <FaRupeeSign />
                <span>Parking Cost</span>
              </li>
            </Link>
          </ul>

          {/* Booking */}
          <Link to={adminPath("booking")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaFile />
              <span>Booking</span>
            </li>
          </Link>

          {/* Users */}
          <Link to={adminPath("users")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaUsers />
              <span>Users</span>
            </li>
          </Link>

          {/* Settings */}
          <Link to={adminPath("settings")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaCogs />
              <span>Settings</span>
            </li>
          </Link>

          {/* Logout */}
          <li
            onClick={logout}
            className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer"
          >
            <FaHome />
            <span>Logout</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;