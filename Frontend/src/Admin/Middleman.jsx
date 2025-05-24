import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Middleman() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submit clicked", formData);  // Debugging line

    // Trim all fields
    const trimmedData = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      location: formData.location.trim(),
    };

    // Check for empty fields
    if (!trimmedData.username) {
      toast.error("Username is required");
      return;
    }

    if (!trimmedData.email) {
      toast.error("Email is required");
      return;
    }

    if (!trimmedData.password) {
      toast.error("Password is required");
      return;
    }

    if (!trimmedData.location) {
      toast.error("Location is required");
      return;
    }

    // Username validations
    const cleanedUsername = trimmedData.username.replace(/\s/g, '');
    if (!cleanedUsername) {
      toast.error("Username cannot be just spaces");
      return;
    }

    if (/^\d/.test(cleanedUsername)) {
      toast.error("Username cannot start with a number");
      return;
    }

    // Email validations
    if (/^\d/.test(trimmedData.email)) {
      toast.error("Email cannot start with a number");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    // Password validations
    if (trimmedData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (/\s/.test(trimmedData.password)) {
      toast.error("Password cannot contain spaces");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in as an admin first");
        return;
      }

      const response = await fetch("http://localhost:3000/api/middleman/signup-middleman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(trimmedData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Middleman added successfully!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setFormData({ username: '', email: '', password: '', location: '' });
        console.log(data);
      } else {
        toast.error(data.message || "Failed to add middleman");
      }
    } catch (error) {
      toast.error("Error adding middleman: " + error.message);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Middleman Management</h1>

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-600">Add New Middleman</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select location</option>
              <option value="Bouddha">Bouddha</option>
              <option value="Patan">Patan</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Middleman
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Middleman;
