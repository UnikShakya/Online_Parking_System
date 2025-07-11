import { useState } from "react";
import { FaChartBar, FaFolder, FaCar, FaFile, FaUsers, FaCogs, FaHome, FaRupeeSign, FaClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ setShowLogin, id }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");  
        localStorage.removeItem("username");  
        setShowLogin(true); 
        navigate("/");
    };
    // Check what id contains
    console.log("Sidebar useParams id:", id);

    const middlemanPath = (path) => `/middleman/bhaktapur/${id}${path ? `/${path}` : ''}`;

    return (
        <aside className="h-screen w-64 bg-designColor text-white flex flex-col">
            {/* Logo Section */}
            <Link to={middlemanPath("")}>
                <div className="flex items-center justify-center py-6">
                    <h1 className="text-2xl text-textColor font-bold cursor-pointer">
                        <span className="text-gradientStart">P</span>ark<span className="text-gradientStart">E</span>ase
                    </h1>
                </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 px-4">
                <ul className="my-2 space-y-3"> 
                    {/* Dashboard */}
                    <Link to={middlemanPath("")}>
                        <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                            <FaFile />
                            <span>Bookings</span>
                        </li>
                    </Link>
                    <Link to={middlemanPath("extend")}>
                        <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                            <FaClock />
                            <span>Extended</span>
                        </li>
                    </Link>

                    <Link to={middlemanPath("middleman")}>
                        <li className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
                            <FaFolder />
                            <span>Middleman</span>
                        </li>
                    </Link>

                    <Link to={middlemanPath("parkinglot")}>

                        <li
                            className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer"
                        >
                            <FaCar />
                            <span>Parking</span>
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