import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function MainLayout({ setShowLogin }) {
  return (
    <div className="flex">
      <Sidebar setShowLogin={setShowLogin} />
      <div className="flex-1 p-4">
        <Outlet /> {/* Renders Dashboard, Booking, or Settings */}
      </div>
    </div>
  );
}

export default MainLayout;