import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popupMessage, setPopupMessage] = useState(""); // State to hold popup message
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", { email, password });
    axios
      .post("http://localhost:5001/signin", { email, password })
      .then((result) => {
        console.log(result);
        if (result.data === "success") {
          setPopupMessage("Login Successful!"); // Set success message
          setShowPopup(true); // Show popup
        } else {
          setPopupMessage("Login Failed: Incorrect email or password."); // Set error message
          setShowPopup(true); // Show popup
        }
      })
      .catch((err) => {
        console.log(err);
        setPopupMessage("An error occurred while signing in."); // General error message
        setShowPopup(true); // Show popup
      });
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide popup
    if (popupMessage === "Login Successful!") {
      navigate("/"); // Redirect only if login is successful
    }
  };

  return (
    <div className="flex justify-center items-center bg-white min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-96"
      >
        <div className="text-center text-2xl font-semibold py-2 text-white">
          LOGIN
        </div>
        <div className="my-4">
          <label className="text-gray-300 text-sm mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 focus:outline-none"
            placeholder="Enter your email"
          />
        </div>
        <div className="my-4">
          <label className="text-gray-300 text-sm mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600"
        >
          SIGN IN
        </button>
        <div className="text- text-textColor py-3">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer hover:text-blue-600">
            <Link to="/signup">Signup</Link>
          </span>
        </div>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-80 text-center shadow-lg">
            <div className="text-lg font-semibold mb-2">
              {popupMessage.includes("Successful") ? "Success!" : "Error"}
            </div>
            <p className="text-sm mb-4">{popupMessage}</p>
            <button
              onClick={handleClosePopup}
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
