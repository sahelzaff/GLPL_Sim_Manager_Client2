'use client'; // Ensure this is a client-side component

import { useState, useEffect } from 'react';
import MainLayout from './Components/MainLayout';
import Login from './login/page'; // Import the Login component
import { isAuthenticated } from '../utils/auth'; // Import your auth utility function

const Page = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const userAuthenticated = await isAuthenticated(); // Check if the user is authenticated
      setAuthenticated(userAuthenticated); // Set the authenticated state
      setLoading(false); // Set loading to false after authentication check
    };

    checkAuth();
  }, []);

  if (loading) {
    // Show a loading spinner or message while checking authentication
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    // If the user is not authenticated, render the login page
    return <Login />;
  }

  // If the user is authenticated, render the MainLayout
  return (
    <>
      <MainLayout />
    </>
  );
};

export default Page;
