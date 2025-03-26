import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Middleman() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting form with data:', formData); // Log form data
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token); // Log the token

      if (!token) {
        console.log('No token found in localStorage');
        toast.error('Please log in as an admin first');
        return;
      }

      console.log('Making fetch request to add-middleman endpoint');
      const response = await fetch('http://localhost:4000/api/middleman/signup-middleman', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status); // Log HTTP status
      const data = await response.json();
      console.log('Response data:', data); // Log the full response

      if (response.ok) {
        console.log('Middleman creation successful:', data);
        toast.success(data.message || 'Middleman added successfully!');
        localStorage.setItem('token', data.token); // Update token if returned
        localStorage.setItem('username', data.username); // Update username if returned
        console.log('New token stored:', data.token);
        console.log('New username stored:', data.username);
        setFormData({ username: '', email: '', password: '' }); // Clear form
      } else {
        console.log('Middleman creation failed:', data.message);
        toast.error(data.message || 'Failed to add middleman');
      }
    } catch (error) {
      console.error('Error during fetch:', error.message); // Log fetch errors
      toast.error('Error adding middleman: ' + error.message);
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
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Middleman
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-600">Other Middleman Options</h2>
        <p className="text-gray-600">Additional middleman management options can be added here.</p>
      </div>
    </div>
  );
}

export default Middleman;