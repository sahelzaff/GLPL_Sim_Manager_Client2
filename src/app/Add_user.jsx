'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const Add_user = ({ users, onCancel }) => {

  const [userDetails, setUserDetails] = useState({
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
  });

  const router = useRouter(); // for redirection

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users', userDetails);
      if (response.status === 201 || response.status === 200) {
        toast.success('User added successfully!');
        
        // Clear the form fields
        setUserDetails({
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
        });

        // Redirect to the home page after 2 seconds (after showing the toast)
        setTimeout(() => {
          router.push('/'); // Assuming '/' is your home page
        }, 2000); // Delay to let the toast show
      }
    } catch (error) {
      toast.error('Error adding user: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className='w-full h-auto max-w-full max-h-full '>
      <div className='flex items-center justify-between w-full  bg-glpl-red p-4'>
        <h2 className="text-3xl font-bold text-white font-outfit">Add New User</h2>
        <button onClick={onCancel} className="m-4 mt-4 bg-white text-glpl-red px-4 py-2 font-bold font-poppins rounded-sm">
          Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col items-start justify-center p-4 w-full pt-10'>
      
        <div className='grid grid-cols-2 gap-x-20 gap-y-5 '>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Name:</label>
            <input type="text" id='Current_User_Name' name='Current_User_Name' value={userDetails.Current_User_Name}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Email:</label>
            <input type="text" id='Current_User_Email' name='Current_User_Email' value={userDetails.Current_User_Email}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Phone Number:</label>
            <input type="text" id='Cell_no' name='Cell_no' value={userDetails.Cell_no}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Sim No:</label>
            <input type="text" id='SIM_No' name='SIM_No' value={userDetails.SIM_No}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Previous Users:</label>
            <input type="text" id='Previous_User' name='Previous_User' value={userDetails.Previous_User}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Plan:</label>
            <input type="text" id='Plan' name='Plan' value={userDetails.Plan}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Plan Cost:</label>
            <input type="text" id='Cost' name='Cost' value={userDetails.Cost}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Location:</label>
            <select
              name="Location"
              id='Location' value={userDetails.Location}
              onChange={handleInputChange}
              // value={updatedUser.Location}
              // onChange={handleInputChange}
              className="border-[1px] border-gray-600 p-1  w-80 "
            >
              <option value="">Select User Location</option>
              <option value="Africa">Africa</option>
              <option value="Agartala">Agartala</option>
              <option value="Ahemdabad">Ahemdabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Gandhidham">Gandhidham</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Jamshedhpur">Jamshedhpur</option>
              <option value="Jodhpur">Jodhpur</option>
              <option value="Ludhiana">Ludhiana</option>
              <option value="Vizag">Vizag</option>
              <option value="Tuticurin">Tuticurin</option>
              <option value="Rudrapur">Rudrapur</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Mode:</label>
            <select
              name="Mode"
              id='Mode' value={userDetails.Mode}
              onChange={handleInputChange}
              className="border-[1px] border-gray-600 p-1  w-80 "
            >
              <option value="">Select Mode</option>
              <option value="Voice Card">Voice Card</option>
              <option value="ESim">ESim</option>
            </select>
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>GLPL Remark:</label>
            <select
              name="Remark"
              id='Remark' value={userDetails.Remark}
              onChange={handleInputChange}
              className="border-[1px] border-gray-600 p-1  w-80 "
            >
              <option value="">Select GLPL Remark</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Instock">In stock</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Vi Status:</label>
            <select
               name="Vi_Status"
               id='Vi_Status' value={userDetails.Vi_Status}
               onChange={handleInputChange}
              className="border-[1px] border-gray-600 p-1  w-80 "
            >
              <option value="">Select Vi Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Instock">In stock</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Department:</label>
            <input type="text" id='Department' name='Department' value={userDetails.Department}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>

          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Reporting Manager:</label>
            <input type="text" id='Reporting_Manager' name='Reporting_Manager' value={userDetails.Reporting_Manager}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>
          <div className='flex flex-col space-x-2 items-start font-poppins '>
            <label htmlFor="" className='text-[14px] ml-2 font-medium'>Reporting Manager Email:</label>
            <input type="text" id='Manager_Email' name='Manager_Email' value={userDetails.Manager_Email}
              onChange={handleInputChange} className='focus:outline-none focus:no-underline border-[1px] border-gray-600 px-3 rounded-sm py-1 w-80' />
          </div>




        </div>

        <div className="w-full flex items-end justify-end">
          <button type='submit' className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out mt-4 m-2 mx-16
        
        '>
            Add User
          </button>
        </div>

      </form>
      <ToastContainer />
    </div>
  )
}

export default Add_user