import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="w-full bg-bodyColor">
      <div className="h-20 flex justify-between items-center px-4 max-w-screen-xl mx-auto">
      <div>
      <Link to="/">
      <h1 className="text-3xl font-bold cursor-pointer">
          <span className="text-designColor">P</span><span className='text-textColor'>ark</span>
          <span className="text-designColor">E</span><span className='text-textColor'>ase</span>
        </h1></Link>
      </div>
        <Link to="/signin"><button className="bg-designColor text-white rounded-full px-6 py-2 text-base hover:bg-opacity-70">
          Login/Signup
      </button></Link>
</div>
    </div>
  );
}

export default Navbar;
