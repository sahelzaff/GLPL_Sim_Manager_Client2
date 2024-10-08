'use client';
import React, { useState } from 'react';
import Home from '../Users/page';
import UserDetails from '../UserDetails/page';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AddUser from '../Add_user.jsx'; // Import the Add_user component

const MainLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Home'); // State to keep track of the active menu item
  const [isAddingUser, setIsAddingUser] = useState(false); // New state to track if AddUser component should be shown

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleUpdateUser = (updatedUser) => {
    // Update the user in the users list or state
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.Sr_no === updatedUser.Sr_no ? updatedUser : user
      )
    );
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  const handleMenuClick = (item) => {
    setActiveMenu(item);
    if (item === 'Logout') {
      // Handle logout functionality here
      console.log('Logging out...');
    }
  };

  // New handler for the "Add User" button
  const handleAddUserClick = () => {
    setIsAddingUser(true); // Set the state to show the AddUser component
  };

  const handleAddUserCancel = () => {
    setIsAddingUser(false); // Go back to the Home page
  };

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col overflow-y-auto">
        <div className="font-poppins flex-1">
          {isAddingUser ? (
            <AddUser onCancel={handleAddUserCancel}  />  
          ) : selectedUser ? (
            <UserDetails user={selectedUser} onGoBack={handleGoBack} onUpdateUser={handleUpdateUser} />
          ) : (
            <Home onUserClick={handleUserClick} onAddUserClick={handleAddUserClick} />  
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
