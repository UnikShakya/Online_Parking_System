import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PatanExtend() {
  const [extendedBookings, setExtendedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token);
    if (!token) {
      setError('Please log in to view extended bookings.');
      setLoading(false);
      navigate('/login');
      return;
    }
    fetchExtendedBookings();
  }, [navigate]);

  const fetchExtendedBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Retrieved token for PatanExtend:', token);
      if (!token) {
        setError('Please log in to view extended bookings.');
        navigate('/login');
        return;
      }
      console.log('Fetching extended bookings...');
      const response = await axios.get("http://localhost:3000/api/parking/extended/patan", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Extended bookings response:', response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Parsed extended bookings data:', data);
      setExtendedBookings(data);
    } catch (err) {
      console.error('Error fetching extended bookings:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to load extended bookings.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Extended Bookings - Patan</h1>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Extended bookings list */}
      {!loading && (
        <div className="space-y-4">
          <div
            className="bg-white shadow overflow-hidden sm:rounded-md"
            style={{ maxHeight: "497px", overflowY: "auto" }}
          >
            <ul className="divide-y divide-gray-200">
              {extendedBookings.length > 0 ? (
                extendedBookings.map((booking) => (
                  <li key={booking._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-indigo-600">
                            {booking.userId?.username || booking.userId?.email || 'Unknown user'}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">Location:</span> {booking.location} | 
                            <span className="font-medium"> Vehicle:</span> {booking.vehicleType}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">Spot:</span> {booking.selectedSpots} | 
                            <span className="font-medium"> Date:</span> {booking.date}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">Time:</span> {booking.startTime} - {booking.endTime}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Extended
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-gray-500">
                  No extended bookings found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatanExtend;