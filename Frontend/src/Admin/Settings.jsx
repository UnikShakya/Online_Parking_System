import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Settings() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, email, password } = formData;

    // Trim spaces
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Username validation
    if (!trimmedUsername) {
      toast.error('Username cannot be blank or only spaces');
      return false;
    }
    if (/^\d/.test(trimmedUsername)) {
      toast.error('Username cannot start with a number');
      return false;
    }

    // Email validation
    if (!trimmedEmail) {
      toast.error('Email cannot be blank');
      return false;
    }
    if (/^\d/.test(trimmedEmail)) {
      toast.error('Email cannot start with a number');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email');
      return false;
    }

    // Password validation
    if (!trimmedPassword) {
      toast.error('Password cannot be blank');
      return false;
    }
    if (trimmedPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in as an admin first');
        return;
      }

      const response = await fetch('http://localhost:3000/api/admin/signup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setFormData({ username: '', email: '', password: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error creating admin: ' + error.message);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-600">Add New Admin</h2>
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
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default Settings;
