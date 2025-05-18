import React, { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import axios from "axios";

function TotalBookings() {
  const [totalBookings, setTotalBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingCount = async () => {
      try {
        setLoading(true);

        // Pass JWT token in headers to authorize user
        const token = localStorage.getItem('token'); // or wherever you store the JWT

        const response = await axios.get('http://localhost:3000/api/profile/my-bookings/count', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTotalBookings(response.data.bookingCount);
        setError(null);
      } catch (err) {
        console.error("Error fetching booking count:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingCount();
  }, []);

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform duration-300 hover:scale-105 cursor-pointer flex items-center gap-4">
      <FaClipboardList className="text-red-600 text-3xl" />
      <div>
        {loading ? (
          <h3 className="text-xl font-bold">Loading...</h3>
        ) : error ? (
          <p className="text-sm text-white">{error}</p>
        ) : (
          <>
            <h3 className="text-xl font-bold">{totalBookings}</h3>
            <p className="text-sm text-white">Your Total Bookings</p>
          </>
        )}
      </div>
    </div>
  );
}

export default TotalBookings;
