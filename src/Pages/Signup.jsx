import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5001/signup", { username, email, password, gender })
      .then((result) => {
        console.log(result);
        if (result.data) {
          setShowPopup(true); // Show popup on success
        }
      })
      .catch((err) => console.log(err));
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/signin"); // Redirect to sign-in page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white relative">
      <form
        onSubmit={handleSubmit}
        className="bg-bodyColor p-6 rounded-lg shadow-md w-96"
      >
        <div className="text-center text-2xl font-semibold py-2 text-white">
          SIGNUP
        </div>
        <div className="my-4">
          <label className="block text-gray-300 text-sm mb-2" htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-gray-300 focus:outline-none"
            placeholder="Enter your username"
          />
        </div>
        <div className="my-4">
          <label className="block text-white text-sm mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            placeholder="Enter your email"
          />
        </div>
        <div className="my-4">
          <label className="block text-white text-sm mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
            placeholder="Create a password"
          />
        </div>
        <div className="mb-4">
  <label className="block text-white text-sm mb-2">Gender:</label>
  <div className="flex items-center space-x-4">
    <label className="text-white">
      <input
        type="radio"
        name="gender"
        value="male"
        onChange={() => setGender("male")}
      />
      Male
    </label>
    <label className="text-white">
      <input
        type="radio"
        name="gender"
        value="female"
        onChange={() => setGender("female")}
      />
      Female
    </label>
    <label className="text-white">
      <input
        type="radio"
        name="gender"
        value="other"
        onChange={() => setGender("other")}
      />
      Other
    </label>
  </div>
</div>

        <button
          type="submit"
          className="w-full bg-designColor text-white py-2 rounded mt-4 hover:bg-opacity-70"
        >
          SIGN UP
        </button>
        <div className="text-sm text-textColor py-3">
          Already have an account?{" "}
          <span className="text-designColor cursor-pointer hover:text-opacity-70">
            <Link to="/signin">Login</Link>
          </span>
        </div>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gray-800 text-white rounded-lg p-6 w-80 text-center shadow-lg">
            <div className="text-lg font-semibold mb-2">Success!</div>
            <p className="text-sm mb-4">Your account has been created successfully.</p>
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

export default Signup;
