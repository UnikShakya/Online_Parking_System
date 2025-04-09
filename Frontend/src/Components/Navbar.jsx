import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoPersonCircle } from 'react-icons/io5';
import { toast } from 'react-toastify';

function Navbar({ setShowLogin }) {
    const [username, setUsername] = useState(null);

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
    };

    return (
        <div className="absolute top-0 left-0 w-full bg-bodyColor text-white z-10">
            <div className="h-20 flex justify-between items-center px-4 max-w-screen-xl mx-auto">
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
                        <IoPersonCircle className="cursor-pointer mr-4" size={30} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;