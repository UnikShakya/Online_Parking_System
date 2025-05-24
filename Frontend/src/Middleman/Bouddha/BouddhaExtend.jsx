import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BouddhaExtend() {
  const [extendedBookings, setExtendedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
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
      if (!token) {
        setError('Please log in to view extended bookings.');
        navigate('/login');
        return;
      }
      
      const response = await axios.get("http://localhost:3000/api/parking/extended/bouddha", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      // Filter out bookings that don't have required data or aren't actually booked
      const validBookings = response.data.filter(booking => 
        booking.extended === true && 
        booking.isBooked === true && 
        booking.userId && 
        booking.date && 
        booking.startTime && 
        booking.endTime
      );
      
      setExtendedBookings(validBookings);
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

  // Format time to ensure consistent display (HH:MM)
  const formatTime = (time) => {
    if (!time) return '--:--';
    if (time.includes(':')) return time;
    if (time.length === 4) return `${time.slice(0, 2)}:${time.slice(2)}`;
    return time;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Extended Bookings - Bouddha</h1>

      {/* Error message display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Extended bookings list */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {extendedBookings.length > 0 ? (
              extendedBookings.map((booking) => (
                <li key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-indigo-700">
                            {booking.userId.username || booking.userId.email}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Extended
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Vehicle:</span> {booking.vehicleType || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Spot:</span> {booking.selectedSpots || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString() || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-8 text-center text-gray-500">
                No valid extended bookings found for Bouddha
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BouddhaExtend;