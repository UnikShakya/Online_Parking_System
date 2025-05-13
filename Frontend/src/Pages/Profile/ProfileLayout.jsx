import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';

const ProfileLayout = ({ setShowLogin }) => {
  return (
<div className="flex">
  <UserSidebar setShowLogin={setShowLogin} />
      <div className="ml-64 flex-1 p-4 overflow-y-auto h-screen">
    <Outlet />
  </div>
</div>

  );
};

export default ProfileLayout;
