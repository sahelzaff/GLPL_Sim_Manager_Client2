'use client';
import React, { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react'; // Import Lottie from lottie-react
import { toast } from 'react-toastify';
import loadingAnimation1 from '../../../public/assets/Animation_1728289722169.json';
import loadingAnimation2 from '../../../public/assets/Animation_1728290862649.json';



const Home = ({ onUserClick, onAddUserClick }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParam, setSearchParam] = useState('Name');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null); // For storing the user to delete
  const [animationData, setAnimationData] = useState(null);
  const itemsPerPage = 25;

  // Fetch users data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/users');
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/users/${userId}`);
      setData((prevData) => prevData.filter((user) => user.Sr_no !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Error deleting user');
    } finally {
      setUserToDelete(null); // Close modal after deletion
    }
  };

  // If data is still loading
  if (isLoading) return <div className="flex w-full items-center justify-center h-full flex-col text-xl">
    <Lottie
            animationData={loadingAnimation1} // Use the imported JSON file
            loop
            autoplay
            style={{ width: '300px', height: '300px' }} // Define styles
          />
          <h1>Loading</h1>
  </div>;
  if (error) return <div className="flex w-full items-center justify-center h-full flex-col text-xl">
    <Lottie
            animationData={loadingAnimation2} // Use the imported JSON file
            loop
            autoplay
            style={{ width: '300px', height: '300px' }} // Define styles
          /> {error.message}</div>;

  // Filtered data based on search term and status filter
  const filteredData = data.filter((item) => {
    const searchField =
      searchParam === 'Name'
        ? item.Current_User_Name.toLowerCase()
        : searchParam === 'Phone Number'
        ? item.Cell_no.toLowerCase()
        : item.SIM_No.toLowerCase();

    const statusMatch = statusFilter ? item.Vi_Status === statusFilter : true;

    return searchField.includes(searchTerm.toLowerCase()) && statusMatch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1); // Reset to first page
  };

  // Get status styling based on status
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Suspended':
        return 'bg-yellow-500 text-black';
      case 'In Stock':
        return 'bg-blue-500 text-white';
      default:
        return '';
    }
  };

  return (
    <div className="p-4">
      {/* Search and filter UI */}
      <div className="flex items-center mb-4 font-poppins">
        <select
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="Name">Name</option>
          <option value="Phone Number">Phone Number</option>
          <option value="Sim No">Sim No</option>
        </select>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border p-2 pr-14"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              <AiOutlineClose />
            </button>
          )}
          <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-500 p-2 rounded-full hover:scale-105 duration-300 transition-transform ease-in-out">
            <AiOutlineSearch className="text-white" />
          </button>
        </div>
      </div>

      {/* Filters and Add User Button */}
      <div className="flex mb-4 font-poppins text-[16px]">
        <button onClick={() => setStatusFilter('Active')} className="border p-2 mr-2">Active</button>
        <button onClick={() => setStatusFilter('Suspended')} className="border p-2 mr-2">Suspended</button>
        <button onClick={() => setStatusFilter('In Stock')} className="border p-2">In Stock</button>

        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 ml-2"
        >
          <option value="">Department</option>
          <option value="Sales">Sales</option>
          <option value="Support">Support</option>
          {/* Add more departments as needed */}
        </select>

        {/* Clear Filters Button */}
        {searchTerm || statusFilter ? (
          <button onClick={clearFilters} className="ml-2 border p-2 bg-red-500 text-white">
            Clear Filters
          </button>
        ) : null}

        <button type="button" className="ml-2 border p-2 bg-red-500 text-white" onClick={onAddUserClick}>Add User</button>
      </div>

      {/* Users Table */}
      <table className="min-w-full border-collapse border">
        <thead>
          <tr className="text-white bg-glpl-red font-outfit">
            <th className="border p-2">Sr No</th>
            <th className="border p-2">Sim No</th>
            <th className="border p-2">Phone No</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item.Sr_no} className="text-center font-poppins">
              <td className="border p-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
              <td className="border p-2">{item.SIM_No}</td>
              <td className="border p-2">+91 {item.Cell_no}</td>
              <td className="border p-2">
                {item.Current_User_Name.charAt(0).toUpperCase() + item.Current_User_Name.slice(1).toLowerCase()}
              </td>
              <td className={`border p-2 ${getStatusStyles(item.Vi_Status)}`}>{item.Vi_Status}</td>
              <td className="border p-2 flex flex-row items-center justify-evenly">
                <button
                  onClick={() => onUserClick(item)} // Pass the entire user object
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => setUserToDelete(item)} // Open confirmation modal
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="border p-2"
        >
          Previous
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="border p-2"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete user{' '}
              <strong>{userToDelete.Current_User_Name}</strong> with Sim No: {userToDelete.SIM_No}?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDeleteUser(userToDelete.Sr_no)}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setUserToDelete(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
