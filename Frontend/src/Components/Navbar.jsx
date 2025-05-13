import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IoPersonCircle, IoMenu, IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

function Navbar({ setShowLogin }) {
  const [username, setUsername] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    toast.success("You have been logged out", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/")
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="sticky top-0 left-0 w-full bg-bodyColor text-white z-10">
      <div className="h-20 flex justify-between items-center px-4 max-w-screen-xl mx-auto">
        {/* Logo */}
        <div>
          <Link to="/">
            <h1 className="text-3xl font-bold cursor-pointer">
              <span className="text-[#ff4546]">P</span>
              <span className="text-textColor">ark</span>
              <span className="text-[#ff4546]">E</span>
              <span className="text-textColor">ase</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex">
          <ul className="flex gap-10 justify-center font-medium text-lg">
            <li>
              <Link to="/#home" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/#about-us" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/#services" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link to="/#location" className="hover:underline">
                Locations
              </Link>
            </li>
            <li>
              <Link to="/#contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Login/Logout and Hamburger (Mobile: Hamburger on Right) */}
        <div className="flex items-center gap-4">
          {/* Login/Logout Section */}
          <div className="flex items-center">
            {!localStorage.getItem("token") ? (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-gradientStart to-gradientEnd hover:opacity-70 text-textColor font-semibold rounded-lg px-6 py-2 text-base hover:bg-opacity-70"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-textColor font-semibold mr-2">
                  Welcome, {username || ""}
                </span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-gradientStart to-gradientEnd hover:opacity-70 text-white rounded-lg px-6 py-2 text-base hover:bg-opacity-70"
                >
                  Logout
                </button>
                <Link to="/profile">
                  <IoPersonCircle className="cursor-pointer mr-4" size={30} />
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Icon (Mobile Only, Right Side) */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} aria-label="Toggle navigation menu">
              {isMenuOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Only Navigation Links) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-bodyColor w-full absolute top-20 left-0 z-10">
          <ul className="flex flex-col gap-6 p-4 font-medium text-lg">
            <li>
              <Link
                to="/#home"
                className="hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/#about-us"
                className="hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/#services"
                className="hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/#contact"
                className="hover:underline"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;