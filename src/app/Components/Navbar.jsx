import React from 'react';
import assets from '../../../public/assets/assets';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white w-full">
      <div className='flex space-x-3 items-center'>
        <img src={assets.glpl_logo} className='w-14' alt="" />
        <h1 className="text-xl font-bold">GLPL Sim Manager</h1>
      </div>
      <div className="flex items-center">
        <span className="mr-4 hover:underline transition-all duration-300 ease-in-out tracking-wide cursor-pointer">User</span>
        <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
