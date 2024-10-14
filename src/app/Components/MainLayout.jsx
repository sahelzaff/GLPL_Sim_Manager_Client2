'use client';
import React, { useState, useCallback, useEffect } from 'react';
import Home from '../Users/page';
import UserDetails from '../UserDetails/page';
import Sidebar from './Sidebar';
import AddUser from '../Add_user.jsx';

const MainLayout = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('Home');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleUserClick = useCallback((user) => {
    console.log("Selected user in MainLayout:", user);
    setSelectedUser(user);
  }, []);

  const handleUpdateUser = useCallback((updatedUser) => {
    console.log("Updated user in MainLayout:", updatedUser);
    setSelectedUser(updatedUser);
  }, []);

  const handleGoBack = useCallback(() => {
    console.log("Going back to user list");
    setSelectedUser(null);
  }, []);

  useEffect(() => {
    console.log("Current selectedUser in MainLayout:", selectedUser);
  }, [selectedUser]);

  const handleMenuClick = useCallback((item) => {
    setActiveMenu(item);
    if (item === 'Logout') {
      // Handle logout functionality here
      console.log('Logging out...');
    }
  }, []);

  const handleAddUserClick = useCallback(() => {
    setIsAddingUser(true);
  }, []);

  const handleAddUserCancel = useCallback(() => {
    setIsAddingUser(false);
  }, []);

  console.log("Current selectedUser:", selectedUser); // Add this line for debugging

  return (
    <div className="flex h-screen">
      <Sidebar activeMenu={activeMenu} onMenuClick={handleMenuClick} />
      
      <div className="flex-1 ml-64 flex flex-col overflow-y-auto">
        <div className="font-poppins flex-1">
          {isAddingUser ? (
            <AddUser onCancel={handleAddUserCancel} />
          ) : selectedUser ? (
            <UserDetails 
              user={selectedUser} 
              onGoBack={handleGoBack} 
              onUpdateUser={handleUpdateUser} 
            />
          ) : (
            <Home onUserClick={handleUserClick} onAddUserClick={handleAddUserClick} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
