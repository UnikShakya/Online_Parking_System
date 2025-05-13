import React from 'react';
import TotalBookings from './InfoCard/TotalBookings';
import UpcomingBooking from './InfoCard/UpcomingBooking';
import FavouriteLocation from './InfoCard/FavLocation';
import LastBooking from './InfoCard/LastBooking';

function UserDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-700">User Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <TotalBookings />
        <UpcomingBooking />
        <FavouriteLocation />
        <LastBooking />
      </div>
    </div>
  );
}

export default UserDashboard;
