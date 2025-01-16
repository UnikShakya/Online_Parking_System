import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoPersonCircle } from "react-icons/io5";

function Navbar({ setShowLogin }) {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");  // Remove the token on logout
        localStorage.removeItem("username");  // Remove the username on logout
        setUsername(null);  // Clear the username state
        setShowLogin(true);  // Show the login popup again
    };

    return (
        <div className="w-full bg-bodyColor">
            <div className="h-20 flex justify-between items-center px-4 max-w-screen-xl mx-auto">
                {/* Logo */}
                <div>
                    <Link to="/">
                        <h1 className="text-3xl font-bold cursor-pointer">
                            <span className="text-designColor">P</span>
                            <span className="text-textColor">ark</span>
                            <span className="text-designColor">E</span>
                            <span className="text-textColor">ase</span>
                        </h1>
                    </Link>
                </div>

                {/* Conditional Rendering for Login/Logout Button, Icon, and Username */}
                {!localStorage.getItem("token") ? (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
                    >
                        Login/Signup
                    </button>
                ) : (
                    <div className="flex items-center">
                        {/* Display Username */}
                        <span className="text-textColor font-semibold mr-4">
                            Welcome, {username || "User"}
                        </span>

                        {/* User Icon */}
                        <IoPersonCircle className="cursor-pointer mr-4" size={30} />

                        {/* Logout Button */}
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
