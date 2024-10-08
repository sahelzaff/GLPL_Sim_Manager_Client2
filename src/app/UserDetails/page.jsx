'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmailModal from './email';


const UserDetails = ({ user, onGoBack, onUpdateUser }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [displayUser, setDisplayUser] = useState(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAModalOpen, setAIsModalOpen] = useState(false);
  const [isOverModalOpen, setOverIsModalOpen] = useState(false);

  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };

  useEffect(() => {
    setUpdatedUser(user);
    setDisplayUser(user);
  }, [user]);

  if (!user) return <div>No user selected</div>;

  // Open the modal when Edit button is clicked
  const handleEditClick = () => {
    setEditModalOpen(true);
  };
  
  const handle90Click = () => {
    setIsModalOpen(true);
  };
  const handle90clickclose = () => {
    setIsModalOpen(false);
  };


  const handle100Click = () => {
    setAIsModalOpen(true);
  };
  const handle100clickclose = () => {
    setAIsModalOpen(false);
  };


  const handleOverClick = () => {
    setOverIsModalOpen(true);
  };
  const handleOverclickclose = () => {
    setOverIsModalOpen(false);
  };

  // Handle input changes in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setDisplayUser((prevUser) => ({
      ...prevUser,
      [name]: value, // Update the specific field based on input name
    }));
  };
  

  // Handle update click to send the updated data to the backend
  const handleUpdateClick = async () => {
    if (!user.Sr_no) {
      console.error('User Sr_no is undefined');
      return;
    }

    try {
      // Send the updated user data to the backend API
      const response = await axios.put(`http://localhost:5000/api/users/${user.Sr_no}`, updatedUser);

      // Check if the response is successful
      if (response.status === 200) {
        // Close the modal
        setEditModalOpen(false);

        // Fetch the updated user details from the backend
        const updatedResponse = await axios.get(`http://localhost:5000/api/users/${user.Sr_no}`);
        onUpdateUser(updatedResponse.data); // Trigger the update user function with fresh data
      } else {
        console.error('Failed to update user:', response.data);
      }
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleEmailSubmit = async () => {
    // Capture the current values from the displayUser state
    const { Current_User_Name, Cell_no, DataUsage, Current_User_Email } = displayUser;

    // Construct the subject and body based on the template
    const subject = `90% Data Usage Alert For +91 ${Cell_no}`;
    const body = `Dear ${Current_User_Name},\n\n` +
      `I hope this message finds you well.\n` +
      `This is to inform you that you have used 90% of your allocated data quota for your Vi number +91 ${Cell_no}. Your remaining data balance is ${DataUsage} GB. Please be advised that any data usage beyond your plan limit will incur additional charges of ₹40 per GB.\n` +
      `We kindly request you to monitor and reduce your data usage to avoid these additional charges.\n\n` +
      `Thank you for your attention to this matter.`;

    try {
      // Construct the request URL with query parameters
      const requestUrl = `http://localhost:5000/api/email/90?to=${encodeURIComponent(Current_User_Email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Make the GET request to the API
      const response = await axios.get(requestUrl);

      if (response.status === 200) {
        // Success, close the modal or show a success message
        setIsModalOpen(false); // Assuming `setIsModalOpen` is the state function to close the modal
        console.log('Email sent successfully:', response.data);
      } else {
        console.error('Failed to send email:', response.data);
      }
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
  };
  const handleAEmailSubmit = async () => {
    // Capture the current values from the displayUser state
    const { Current_User_Name, Cell_no, DataUsage, Current_User_Email } = displayUser;

    // Construct the subject and body based on the template
    const subject = `100% Data Usage Alert For +91 ${Cell_no}`;
    const body = `Dear ${Current_User_Name},\n\n` +
      `I hope this message finds you well.\n` +
      `This is to inform you that you have used 100% of your allocated data quota for your Vi number +91 ${Cell_no}. Your remaining data balance is ${DataUsage} GB. Please be advised that any data usage beyond your plan limit will incur additional charges of ₹40 per GB.\n` +
      `We kindly request you to monitor and reduce your data usage to avoid these additional charges.\n\n` +
      `Thank you for your attention to this matter.`;

    try {
      // Construct the request URL with query parameters
      const requestUrl = `http://localhost:5000/api/email/100?to=${encodeURIComponent(Current_User_Email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Make the GET request to the API
      const response = await axios.get(requestUrl);

      if (response.status === 200) {
        // Success, close the modal or show a success message
        setIsModalOpen(false); // Assuming `setIsModalOpen` is the state function to close the modal
        console.log('Email sent successfully:', response.data);
      } else {
        console.error('Failed to send email:', response.data);
      }
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
  };
  const handleOverEmailSubmit = async () => {
    // Capture the current values from the displayUser state
    const { Current_User_Name, Cell_no, DataUsage, Current_User_Email } = displayUser;

    // Construct the subject and body based on the template
    const subject = `Data Limit Exceeded Additional Charges Applied For +91 ${Cell_no}`;
    const body = `Dear ${Current_User_Name},\n\n` +
      `I hope this message finds you well.\n\n` +
      `This is to inform you that you have fully utilised your allocated data quota for your Vi number +91 ${Cell_no}. As a result, you are now browsing at standard rates and have consumed ${DataUsage} GB of data beyond your plan.\n` +
      `Please be aware that continuing to use data at this rate will incur additional charges. We recommend reducing your data usage to avoid further costs.\n` +
      `If you have any questions or need assistance, please don't hesitate to reach out.\n`+
      `We kindly request you to monitor and reduce your data usage to avoid these additional charges.\n\n` +
      `Thank you for your attention to this matter.`;

    try {
      // Construct the request URL with query parameters
      const requestUrl = `http://localhost:5000/api/email/dataOveremail?to=${encodeURIComponent(Current_User_Email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Make the GET request to the API
      const response = await axios.get(requestUrl);

      if (response.status === 200) {
        // Success, close the modal or show a success message
        setIsModalOpen(false); // Assuming `setIsModalOpen` is the state function to close the modal
        console.log('Email sent successfully:', response.data);
      } else {
        console.error('Failed to send email:', response.data);
      }
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
  };

  // Helper function to format and split previous users
  const formatPreviousUsers = (previousUsers) => {
    if (!previousUsers) return ['None'];
    return previousUsers.split('/').map((name) => name.trim());
  };

  return (
    <div>
      <div className='w-full bg-glpl-red p-2 mb-4 flex justify-between items-center'>
        <h2 className="text-3xl font-bold text-white font-outfit">User Details</h2>
        <button onClick={onGoBack} className="m-4 mt-4 bg-white text-glpl-red px-4 py-2 font-bold font-poppins rounded-sm">
          Go Back
        </button>
      </div>

      {/* Main User Details Section */}
      <div className='p-4'>
        <h1 className='font-outfit font-bold text-xl'>Personal Data</h1>
        <hr />
      </div>

      <div className='px-4 font-poppins text-[16px] grid grid-cols-3 gap-y-3'>
        <div className='col-span-1 space-y-2'>
          <p><strong>Name:</strong> {user.Current_User_Name ? user.Current_User_Name.charAt(0).toUpperCase() + user.Current_User_Name.slice(1).toLowerCase() : 'None'}</p>
          <p><strong>Phone No:</strong> {user.Cell_no ? `+91 ${user.Cell_no}` : 'None'}</p>
          <p><strong>Location:</strong> {user.Location || 'None'}</p>
        </div>

        <div className='col-span-1 space-y-2'>
          <p><strong>Email:</strong> {user.Current_User_Email || 'None'}</p>
          <div>
            <strong>Previous Users:</strong>
            <div className='mt-2 space-y-2'>
              {formatPreviousUsers(user.Previous_User).map((name, index) => (
                <div key={index} className='bg-glpl-red text-white p-2 rounded-sm'>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sim Information */}
      <div className='p-4 mt-4'>
        <h1 className='font-outfit font-bold text-xl'>Sim Information</h1>
        <hr />
      </div>

      <div className='px-4 font-poppins text-[16px] grid grid-cols-3 gap-y-3 space-x-6'>
        <div className='col-span-1 space-y-2'>
          <p><strong>Sim No:</strong> {user.SIM_No || 'None'}</p>
          <p><strong>Plan Name:</strong> {user.PlanName || 'None'}</p>
          <p><strong>Asset Mapping:</strong> {user.Asset_Mapping || 'None'}</p>
        </div>

        <div className='col-span-1 space-y-2'>
          <p><strong>Plan Cost:</strong> ₹{user.Cost || 'None'}</p>
          <p><strong>Vi Status:</strong> {user.Vi_Status || 'None'}</p>
          <p><strong>Mode:</strong> {user.Mode || 'None'}</p>
          <p><strong>GLPL Remark:</strong> {user.Remark || 'None'}</p>
        </div>
      </div>

      {/* Work Details */}
      <div className='p-4 mt-4'>
        <h1 className='font-outfit font-bold text-xl'>Work Details</h1>
        <hr />
      </div>

      <div className='px-4 font-poppins text-[16px] grid grid-cols-3 gap-y-3 space-x-6'>
        <div className='col-span-1 space-y-2'>
          <p><strong>Designation:</strong> {user.Designation || 'None'}</p>
          <p><strong>Department:</strong> {user.Department || 'None'}</p>
          <p><strong>Email:</strong> {user.Current_User_Email || 'None'}</p>
        </div>

        <div className='col-span-1 space-y-2'>
          <p><strong>Reporting Manager:</strong> {user.Reporting_Manager || 'None'}</p>
          <p><strong>Reporting Manager Email:</strong> {user.Manager_Email || 'None'}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='w-full max-w-max p-4 flex space-x-1 items-center mx-auto justify-between pt-4'>
        <button onClick={handleEditClick} className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out'>
          Edit
        </button>
        <button className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out' onClick={handle90Click}>
          90% Email
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Send 90% Email</h2>
              <input
                type="text"
                name="name"
                value={displayUser.Current_User_Name}
                onChange={handleEmailInputChange}
                placeholder="Name"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="cellNo"
                value={displayUser.Cell_no}
                onChange={handleEmailInputChange}
                placeholder="Cell Number"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="dataUsage"
                value={displayUser.DataUsage}
                onChange={handleEmailInputChange}
                placeholder="Data Usage"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={displayUser.Current_User_Email}
                onChange={handleEmailInputChange}
                placeholder="Email"
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                  onClick={handle90clickclose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                  onClick={handleEmailSubmit}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}
        {/* <EmailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={{
            Current_User_Name: user.Current_User_Name,
            Cell_no: user.Cell_no,
            Current_User_Email: user.Current_User_Email
          }}
        /> */}
        <button className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out' onClick={handle100Click}>
          100% Email
        </button>
        {isAModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Send 100% Email</h2>
              <input
                type="text"
                name="name"
                value={displayUser.Current_User_Name}
                onChange={handleEmailInputChangehandleEmailInputChange}
                placeholder="Name"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="cellNo"
                value={displayUser.Cell_no}
                onChange={handleEmailInputChangehandleEmailInputChange}
                placeholder="Cell Number"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="dataUsage"
                value={displayUser.DataUsage}
                onChange={handleEmailInputChangehandleEmailInputChange}
                placeholder="Data Usage"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={displayUser.Current_User_Email}
                onChange={handleEmailInputChangehandleEmailInputChange}
                placeholder="Email"
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                  onClick={handle100clickclose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                  onClick={handleAEmailSubmit}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}
        <button className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out' onClick={handleOverClick}>
          Data Over Email
        </button>


        {isOverModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Send Data Over Email</h2>
              <input
                type="text"
                name="name"
                value={displayUser.Current_User_Name}
                onChange={handleEmailInputChange}
                placeholder="Name"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="cellNo"
                value={displayUser.Cell_no}
                onChange={handleEmailInputChange}
                placeholder="Cell Number"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="dataUsage"
                value={displayUser.DataUsage}
                onChange={handleEmailInputChange}
                placeholder="Data Usage"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={displayUser.Current_User_Email}
                onChange={handleEmailInputChange}
                placeholder="Email"
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                  onClick={handleOverclickclose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                  onClick={handleOverEmailSubmit}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}


        <button className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out'>
          Approval Email
        </button>
        <button onClick={onGoBack} className="px-7 py-2 bg-glpl-red text-white font-medium">
          Go Back
        </button>
        <hr />
      </div>

      {/* Modal for Editing */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit User Details</h2>

            <div className="grid grid-cols-2 gap-4 text-[14px]">
              <div>
                <label><strong>Name:</strong></label>
                <input
                  type="text"
                  name="Current_User_Name"
                  value={updatedUser.Current_User_Name}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label><strong>Email:</strong></label>
                <input
                  type="email"
                  name="Current_User_Email"
                  value={updatedUser.Current_User_Email}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label><strong>Previous User:</strong></label>
                <input
                  type="text"
                  name="Previous_User"
                  value={updatedUser.Previous_User}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label><strong>Location:</strong></label>
                <select
                  name="Location"
                  value={updatedUser.Location}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
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
              <div>
                <label><strong>Mode:</strong></label>
                <select
                  name="Mode"
                  value={updatedUser.Mode}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select a Mode</option>
                  <option value="Voice Card">Voice Card</option>
                  <option value="ESim">ESim</option>
                </select>
              </div>
              <div>
                <label><strong>GLPL Remark:</strong></label>
                <select
                  name="Remark"
                  value={updatedUser.Remark}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select a Remark</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Instock">In stock</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label><strong>Vi Status:</strong></label>
                <select
                  name="Vi_Status"
                  value={updatedUser.Vi_Status}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select a Remark</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Instock">In stock</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label><strong>Asset Mapping:</strong></label>
                <select
                  name="Asset_Mapping"
                  value={updatedUser.Asset_Mapping}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select a Status</option>
                  <option value="Active">Done</option>
                  <option value="Suspended">Pending</option>
                </select>
              </div>

              <div>
                <label><strong>Department :</strong></label>
                <input
                  type="text"
                  name="Department"
                  value={updatedUser.Department}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label><strong>Reporting Manager :</strong></label>
                <input
                  type="text"
                  name="Reporting_Manager"
                  value={updatedUser.Reporting_Manager}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label><strong>Manager Email :</strong></label>
                <input
                  type="text"
                  name="Manager_Email"
                  value={updatedUser.Manager_Email}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>

            </div>

            <div className="flex justify-end mt-4">
              <button onClick={handleUpdateClick} className="bg-glpl-red text-white px-4 py-2 rounded">
                Update
              </button>
              <button onClick={() => setEditModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded ml-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
