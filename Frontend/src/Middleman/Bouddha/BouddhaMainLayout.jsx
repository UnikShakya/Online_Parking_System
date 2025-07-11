import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

function BouddhaMainLayout({ setShowLogin }) {
  const { id } = useParams();

  return (
    <div className="flex h-screen overflow-hidden"> 
      <div className="fixed h-full"> 
        <Sidebar setShowLogin={setShowLogin} id={id}/>
      </div>
      
      <div className="flex-1 ml-64 p-4 overflow-y-auto"> 
        <Outlet />
      </div>
    </div>
  );
}

export default BouddhaMainLayout;