import { useState } from "react";
import { FaChartBar, FaFolder, FaCar, FaFile, FaUsers, FaCogs, FaHome, FaRupeeSign } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setShowLogin, id }) => {
  const [isParkingOpen, setIsParkingOpen] = useState(false); 
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("username");  
    setShowLogin(true);  
    navigate("/");
  };
    console.log("Sidebar useParams id:", id);

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
        <ul className="my-2 space-y-3"> 
          <Link to={adminPath("")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaChartBar />
              <span>Dashboard</span>
            </li>
          </Link>

          <Link to={adminPath("middleman")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaFolder />
              <span>Middleman</span>
            </li>
          </Link>

          <li
            className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer"
            onClick={() => setIsParkingOpen(!isParkingOpen)} 
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
            <Link to={adminPath("parkinglot")}>
              <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                <FaCar />
                <span>Parking Lot</span>
              </li>
            </Link>

            <Link to={adminPath("parkingcost")}>
              <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                <FaRupeeSign />
                <span>Parking Cost</span>
              </li>
            </Link>
          </ul>
          <Link to={adminPath("users")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaUsers />
              <span>Users</span>
            </li>
          </Link>

          <Link to={adminPath("settings")}>
            <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
              <FaCogs />
              <span>Settings</span>
            </li>
          </Link>

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