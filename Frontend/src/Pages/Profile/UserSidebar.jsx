import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaClock, FaHistory, FaCogs, FaSignOutAlt } from "react-icons/fa";

const UserSidebar = ({ setShowLogin }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setShowLogin(true);
    navigate("/");
  };

  return (
<aside className="w-64 bg-designColor text-textColor flex flex-col h-screen fixed left-0 top-0">
      <div className="flex justify-center py-6">
        <h1 className="text-2xl font-bold">
          <span className="text-gradientStart">P</span>ark
          <span className="text-gradientStart">E</span>ase
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-3">
        <Link to="/profile">
          <div className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
            <FaUser />
            <span>Profile</span>
          </div>
        </Link>

        <Link to="/profile/upcoming">
          <div className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
            <FaClock />
            <span>Upcoming Bookings</span>
          </div>
        </Link>

        <Link to="/profile/history">
          <div className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer">
            <FaHistory />
            <span>Booking History</span>
          </div>
        </Link>

        <div
          onClick={logout}
          className="flex items-center space-x-4 hover:bg-gradient-to-r from-gradientStart to-gradientEnd p-2 rounded cursor-pointer"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </div>
      </nav>
    </aside>
  );
};

export default UserSidebar;
