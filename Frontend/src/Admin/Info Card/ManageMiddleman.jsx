import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageMiddleman() {
  const [middlemanCount, setMiddlemanCount] = useState(null);

  useEffect(() => {
    const fetchMiddlemanCount = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/middleman/count');
        if (response.data.success) {
          setMiddlemanCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching middleman count:', error);
      }
    };

    fetchMiddlemanCount();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
      <h3 className="text-lg font-semibold">Total Middlemen</h3>
      <p className="text-4xl font-bold mt-2">
        {middlemanCount === null ? 'Loading...' : (middlemanCount > 0 ? middlemanCount : 'No middleman yet')}
      </p>
    </div>
  );
}

export default ManageMiddleman;
