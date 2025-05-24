import React from 'react';
import { Outlet } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

function BhaktapurMainLayout({ setShowLogin }) {
  const { id } = useParams();

  return (
    <div className="flex h-screen overflow-hidden"> {/* Added h-screen and overflow-hidden */}
      {/* Fixed Sidebar */}
      <div className="fixed h-full"> {/* Wrapped Sidebar in a fixed container */}
        <Sidebar setShowLogin={setShowLogin} id={id}/>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 ml-64 p-4 overflow-y-auto"> {/* Added ml-64 and overflow-y-auto */}
        <Outlet />
      </div>
    </div>
  );
}

export default BhaktapurMainLayout;