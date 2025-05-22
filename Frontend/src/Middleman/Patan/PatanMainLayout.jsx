import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

function PatanMainLayout({ setShowLogin }) {
  const { id } = useParams(); // Capture the token in the URL

  return (
    <div className="flex">
      <Sidebar setShowLogin={setShowLogin} id={id}/>
      <div className="flex-1 p-4">
        <Outlet /> {/* This will render Dashboard, Booking, or Settings */}
      </div>
    </div>
  );
}

export default PatanMainLayout;
