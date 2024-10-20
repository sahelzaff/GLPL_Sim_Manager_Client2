'use client';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialUserState = {
  Current_User_Name: '',
  Cell_no: '',
  Current_User_Email: '',
  Previous_User: '',
  SIM_No: '',
  Plan: '',
  Cost: '',
  Location: '',
  Mode: '',
  Remark: '',
  Vi_Status: '',
  Department: '',
  Reporting_Manager: '',
  Manager_Email: '',
  Designation: '', // Added Designation field
};

const Add_user = ({ onCancel }) => {
  const [userDetails, setUserDetails] = useState(initialUserState);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.45.130:5021/api/users', userDetails);
      if (response.status === 201) {
        toast.success('User added successfully!');
        setUserDetails(initialUserState);
        setTimeout(() => {
          onCancel(); // This will return to the Home page
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(error.response?.data?.error || 'Error adding user. Please try again.');
    }
  }, [userDetails, onCancel]);

  return (
    <div className='w-full h-auto max-w-full max-h-full'>
      <div className='flex items-center justify-between w-full bg-glpl-red p-4'>
        <h2 className="text-3xl font-bold text-white font-outfit">Add New User</h2>
        <button onClick={onCancel} className="m-4 mt-4 bg-white text-glpl-red px-4 py-2 font-bold font-poppins rounded-sm">
          Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col items-start justify-center p-4 w-full pt-10'>
        <div className='grid grid-cols-2 gap-x-20 gap-y-5'>
          {Object.entries(userDetails).map(([key, value]) => (
            <div key={key} className='flex flex-col space-x-2 items-start font-poppins'>
              <label htmlFor={key} className='text-[14px] ml-2 font-medium'>{key.replace(/_/g, ' ')}:</label>
              {['Location', 'Mode', 'Remark', 'Vi_Status'].includes(key) ? (
                <select
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="border-[1px] border-gray-600 p-1 w-80"
                >
                  <option value="">Select {key.replace(/_/g, ' ')}</option>
                  {/* Add options based on the field */}
                  {key === 'Location' && [
                    'Africa', 'Agartala', 'Ahemdabad', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Nagpur',
                    'Gandhidham', 'Jaipur', 'Jamshedhpur', 'Jodhpur', 'Ludhiana', 'Vizag', 'Tuticurin',
                    'Rudrapur', 'Kolkata', 'Hyderabad'
                  ].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  {key === 'Mode' && ['Voice Card', 'ESim'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  {(key === 'Remark' || key === 'Vi_Status') && ['Active', 'Suspended', 'In Stock', 'Disabled'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80'
                />
              )}
            </div>
          ))}
        </div>

        <div className="w-full flex items-end justify-end">
          <button type='submit' className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out mt-4 m-2 mx-16'>
            Add User
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Add_user;