'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import axios from 'axios';
import Lottie from 'lottie-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDebounce } from 'use-debounce';
import loadingAnimation1 from '../../../public/assets/Animation_1728289722169.json';
import loadingAnimation2 from '../../../public/assets/Animation_1728290862649.json';

const fetchUsers = async ({ queryKey }) => {
  const [_, page, searchTerm, searchParam, statusFilter] = queryKey;
  try {
    const response = await axios.get('http://localhost:5000/api/users', {
      params: { 
        page, 
        searchTerm, 
        searchParam, 
        statusFilter, 
        per_page: 25 
      }
    });
    console.log('API Response:', response.data); // Add this line for debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// LoadingAnimation component
const LoadingAnimation = ({ animation, text }) => (
  <div className="flex w-full items-center justify-center h-full flex-col text-xl">
    <Lottie
      animationData={animation}
      loop
      autoplay
      style={{ width: '300px', height: '300px' }}
    />
    <h1>{text}</h1>
  </div>
);

// SearchAndFilterUI component
const SearchAndFilterUI = ({ searchParam, setSearchParam, searchTerm, setSearchTerm, statusFilter, setStatusFilter, clearFilters, onAddUserClick, onSearch }) => (
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
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onSearch();
          }
        }}
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
      <button 
        onClick={onSearch}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-500 p-2 rounded-full hover:scale-105 duration-300 transition-transform ease-in-out"
      >
        <AiOutlineSearch className="text-white" />
      </button>
    </div>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border p-2 ml-2"
    >
      <option value="">All Status</option>
      <option value="Active">Active</option>
      <option value="Suspended">Suspended</option>
      <option value="In Stock">In Stock</option>
    </select>
    {(searchTerm || statusFilter) && (
      <button onClick={clearFilters} className="ml-2 border p-2 bg-gray-200">
        Clear Filters
      </button>
    )}
    <button onClick={onAddUserClick} className="ml-2 border p-2 bg-red-500 text-white">
      Add User
    </button>
  </div>
);

// UserTable component
const UserTable = ({ data, currentPage, getStatusStyles, onUserClick, setUserToDelete }) => (
  <table className="min-w-full border-collapse border">
    <thead>
      <tr className="text-white bg-glpl-red font-outfit">
        <th className="border p-2">Sr No</th>
        <th className="border p-2">Sim No</th>
        <th className="border p-2">Phone No</th>
        <th className="border p-2">Name</th>
        <th className="border p-2">Status</th>
        <th className="border p-2">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data && data.map((item, index) => (
        <tr key={item.Sr_no} className="text-center font-poppins">
          <td className="border p-2">{index + 1 + (currentPage - 1) * 25}</td>
          <td className="border p-2">{item.SIM_No}</td>
          <td className="border p-2">+91 {item.Cell_no}</td>
          <td className="border p-2">{item.Current_User_Name}</td>
          <td className={`border p-2 ${getStatusStyles(item.Vi_Status)}`}>{item.Vi_Status}</td>
          <td className="border p-2">
            <button
              onClick={() => {
                console.log("Clicked user:", item); // Add this line for debugging
                onUserClick(item);
              }}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              View
            </button>
            <button
              onClick={() => setUserToDelete(item)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Pagination component
const Pagination = ({ currentPage, setCurrentPage, totalPages }) => (
  <div className="flex justify-between mt-4">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="border p-2 bg-gray-200 disabled:opacity-50"
    >
      Previous
    </button>
    <span>Page {currentPage} of {totalPages}</span>
    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="border p-2 bg-gray-200 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

// DeleteConfirmationModal component
const DeleteConfirmationModal = ({ userToDelete, handleDeleteUser, setUserToDelete }) => (
  userToDelete && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete user {userToDelete.Current_User_Name}?</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleDeleteUser(userToDelete.Sr_no)}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Delete
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
  )
);

const Home = ({ onUserClick, onAddUserClick }) => {
  const [searchParam, setSearchParam] = useState('Name');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState(null);
  const queryClient = useQueryClient();

  const { data, error, isLoading, refetch } = useQuery(
    ['users', currentPage, debouncedSearchTerm, searchParam, statusFilter],
    fetchUsers,
    { 
      keepPreviousData: true,
      staleTime: 60000, // 1 minute
    }
  );

  const handleSearch = useCallback(() => {
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const handleDeleteUser = useCallback(async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      queryClient.invalidateQueries('users');
      setUserToDelete(null);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  }, [queryClient]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const getStatusStyles = useMemo(() => (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500 text-white';
      case 'Suspended': return 'bg-yellow-500 text-black';
      case 'In Stock': return 'bg-blue-500 text-white';
      default: return '';
    }
  }, []);

  if (isLoading) return <LoadingAnimation animation={loadingAnimation1} text="Loading" />;
  if (error) return <LoadingAnimation animation={loadingAnimation2} text={error.message} />;

  return (
    <div className="p-4">
      <SearchAndFilterUI
        searchParam={searchParam}
        setSearchParam={setSearchParam}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
        onAddUserClick={onAddUserClick}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <LoadingAnimation animation={loadingAnimation1} text="Loading" />
      ) : error ? (
        <LoadingAnimation animation={loadingAnimation2} text={error.message} />
      ) : data && data.users ? (
        <>
          <UserTable
            data={data.users}
            currentPage={currentPage}
            getStatusStyles={getStatusStyles}
            onUserClick={onUserClick}
            setUserToDelete={setUserToDelete}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={data.totalPages}
          />
        </>
      ) : (
        <div>No users found</div>
      )}

      <DeleteConfirmationModal
        userToDelete={userToDelete}
        handleDeleteUser={handleDeleteUser}
        setUserToDelete={setUserToDelete}
      />

      <ToastContainer />
    </div>
  );
};

export default Home;