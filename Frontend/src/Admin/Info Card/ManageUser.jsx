import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageUser() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/userCount');  
        if (response.data && response.data.userCount !== undefined) {
          setUserCount(response.data.userCount);
        } else {
          console.error('Invalid response format', response);
          setUserCount(0);  
        }
      } catch (error) {
        console.error('Error fetching user count:', error);
        setUserCount(0);  
      }
    };

    fetchUserCount();
  }, []);  

  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white hover:shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer">
      <h3 className="text-lg font-semibold">Total Users</h3>
      <p className="text-4xl font-bold mt-2">
        {userCount > 0 ? userCount : "No users yet"}
      </p>
    </div>
  );
}

export default ManageUser;
