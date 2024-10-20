'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import EmailModal from './email';

const UserDetails = ({ user: initialUser, onGoBack, onUpdateUser }) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [updatedUser, setUpdatedUser] = useState(initialUser);
  const [displayUser, setDisplayUser] = useState(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAModalOpen, setAIsModalOpen] = useState(false);
  const [isOverModalOpen, setOverIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [approvalEmailData, setApprovalEmailData] = useState({
    month: '',
    name: '',
    reporting_manager: '',
    planname: '',
    base: '',
    isd_minutes: ''
  });

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setUpdatedUser(initialUser);
      setDisplayUser(initialUser);
    }
  }, [initialUser]);

  const handleEditClick = useCallback(() => {
    setEditModalOpen(true);
  }, []);
  
  const handle90Click = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handle90clickclose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handle100Click = useCallback(() => {
    setAIsModalOpen(true);
  }, []);

  const handle100clickclose = useCallback(() => {
    setAIsModalOpen(false);
  }, []);

  const handleOverClick = useCallback(() => {
    setOverIsModalOpen(true);
  }, []);

  const handleOverclickclose = useCallback(() => {
    setOverIsModalOpen(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEmailInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setDisplayUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }, []);
  
  const handleUpdateClick = useCallback(async () => {
    if (!user || !user.Sr_no) {
      console.error('User or Sr_no is undefined');
      toast.error('Error updating user: Invalid user data');
      return;
    }

    try {
      const response = await axios.put(`http://192.168.45.130:5021/api/users/${user.Sr_no}`, updatedUser);
      if (response.status === 200) {
        setEditModalOpen(false);
        setUser(response.data);
        onUpdateUser(response.data);
        toast.success('User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    }
  }, [updatedUser, user, onUpdateUser]);

  const handleEmailSubmit = useCallback(async (emailType) => {
    // Capture the current values from the displayUser state
    const { Current_User_Name, Cell_no, DataUsage, Current_User_Email } = displayUser;

    // Construct the subject and body based on the email type
    let subject, body;
    switch (emailType) {
      case '90':
        subject = `90% Data Usage Alert For +91 ${Cell_no}`;
        body = `Dear ${Current_User_Name},\n\n` +
          `I hope this message finds you well.\n` +
          `This is to inform you that you have used 90% of your allocated data quota for your Vi number +91 ${Cell_no}. Your remaining data balance is ${DataUsage} GB. Please be advised that any data usage beyond your plan limit will incur additional charges of ₹40 per GB.\n` +
          `We kindly request you to monitor and reduce your data usage to avoid these additional charges.\n\n` +
          `Thank you for your attention to this matter.`;
        break;
      case '100':
        subject = `100% Data Usage Alert For +91 ${Cell_no}`;
        body = `Dear ${Current_User_Name},\n\n` +
          `I hope this message finds you well.\n` +
          `This is to inform you that you have used 100% of your allocated data quota for your Vi number +91 ${Cell_no}. Your remaining data balance is ${DataUsage} GB. Please be advised that any data usage beyond your plan limit will incur additional charges of ₹40 per GB.\n` +
          `We kindly request you to monitor and reduce your data usage to avoid these additional charges.\n\n` +
          `Thank you for your attention to this matter.`;
        break;
      case 'over':
        subject = `Data Limit Exceeded Additional Charges Applied For +91 ${Cell_no}`;
        body = `Dear ${Current_User_Name},\n\n` +
          `I hope this message finds you well.\n\n` +
          `This is to inform you that you have fully utilised your allocated data quota for your Vi number +91 ${Cell_no}. As a result, you are now browsing at standard rates and have consumed ${DataUsage} GB of data beyond your plan.\n` +
          `Please be aware that continuing to use data at this rate will incur additional charges. We recommend reducing your data usage to avoid further costs.\n` +
          `If you have any questions or need assistance, please don't hesitate to reach out.\n` +
          `We kindly request you to monitor and reduce your data usage to avoid these additional charges.\n\n` +
          `Thank you for your attention to this matter.`;
        break;
      default:
        toast.error('Invalid email type');
        return;
    }

    try {
      // Construct the request URL with query parameters
      const requestUrl = `http://192.168.45.130:5021/api/email/${emailType}?to=${encodeURIComponent(Current_User_Email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const response = await axios.get(requestUrl);

      // Close the modal regardless of the response
      setIsModalOpen(false);
      setAIsModalOpen(false);
      setOverIsModalOpen(false);

      if (response.data && response.data.message) {
        // If we have a success message from the server
        toast.success(response.data.message);
      } else {
        // If we don't have a specific message, use a generic success message
        toast.success('Email Composed Successfully');
      }

      console.log('Email composition response:', response.data);
    } catch (error) {
      console.error('Error composing email:', error.response ? error.response.data : error.message);
      
      // Close the modal even if there's an error
      setIsModalOpen(false);
      setAIsModalOpen(false);
      setOverIsModalOpen(false);

      // Show an error toast, but with a more user-friendly message
      toast.error('There was an issue composing the email, but it may have been created in Outlook. Please check your drafts.');
    }
  }, [displayUser]);

  // Helper function to format and split previous users
  const formatPreviousUsers = useCallback((previousUsers) => {
    if (!previousUsers) return ['None'];
    return previousUsers.split('/').map((name) => name.trim());
  }, []);

  const handleApprovalEmailInputChange = (e) => {
    const { name, value } = e.target;
    setApprovalEmailData(prev => ({ ...prev, [name]: value }));
  };

  const handleApprovalEmailSubmit = async () => {
    const subject = `Approval Request for Vodafone Mobile Bills ${approvalEmailData.month} ${user.Current_User_Name}`;
    const body = `Dear ${user.Reporting_Manager},

Please find attached the Vodafone mobile bills ${approvalEmailData.month} for ${user.Current_User_Name}. The details are as follows:
• ${user.Current_User_Name}:
   Plan - ${user.PlanName}
   Base - ${user.Cost}
   ISD ${approvalEmailData.isd_minutes || 'N/A'} mins - 

Kindly review and approve the bills at your earliest convenience.`;

    try {
      console.log('Sending approval email with data:', { to: user.Manager_Email, subject, body });
      const response = await axios.get(`http://192.168.45.130:5021/api/email/approval`, {
        params: {
          to: user.Manager_Email,
          subject,
          body
        }
      });

      console.log('Approval email response:', response.data);

      if (response.data && response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success('Approval Email Composed Successfully');
      }

      setIsApprovalModalOpen(false);
    } catch (error) {
      console.error('Error composing approval email:', error.response ? error.response.data : error.message);
      toast.error(`Error composing approval email: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  if (!user) return <div>No user selected</div>;

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
                name="Current_User_Name"
                value={displayUser.Current_User_Name}
                onChange={handleEmailInputChange}
                placeholder="Name"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="Cell_no"
                value={displayUser.Cell_no}
                onChange={handleEmailInputChange}
                placeholder="Cell Number"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="DataUsage"
                value={displayUser.DataUsage}
                onChange={handleEmailInputChange}
                placeholder="Data Usage"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="email"
                name="Current_User_Email"
                value={displayUser.Current_User_Email}
                onChange={handleEmailInputChange}
                placeholder="Email"
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                  onClick={() => handleEmailSubmit('90')}
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
                name="Current_User_Name"
                value={displayUser.Current_User_Name}
                onChange={handleEmailInputChange}
                placeholder="Name"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="Cell_no"
                value={displayUser.Cell_no}
                onChange={handleEmailInputChange}
                placeholder="Cell Number"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="DataUsage"
                value={displayUser.DataUsage}
                onChange={handleEmailInputChange}
                placeholder="Data Usage"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="email"
                name="Current_User_Email"
                value={displayUser.Current_User_Email}
                onChange={handleEmailInputChange}
                placeholder="Email"
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                  onClick={() => setAIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                  onClick={() => handleEmailSubmit('100')}
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
                name="Current_User_Name"
                value={displayUser.Current_User_Name}
                onChange={handleEmailInputChange}
                placeholder="Name"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="Cell_no"
                value={displayUser.Cell_no}
                onChange={handleEmailInputChange}
                placeholder="Cell Number"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="text"
                name="DataUsage"
                value={displayUser.DataUsage}
                onChange={handleEmailInputChange}
                placeholder="Data Usage"
                className="border border-gray-300 p-2 mb-2 w-full"
              />
              <input
                type="email"
                name="Current_User_Email"
                value={displayUser.Current_User_Email}
                onChange={handleEmailInputChange}
                placeholder="Email"
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                  onClick={() => setOverIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                  onClick={() => handleEmailSubmit('over')}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        )}


        <button onClick={() => setIsApprovalModalOpen(true)} className='px-7 py-2 bg-glpl-red text-white font-medium hover:bg-red-800 transition-colors duration-300 ease-in-out'>
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
          <div className="bg-white p-6 rounded-md max-w-[800px] w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit User Details</h2>

            <div className="grid grid-cols-2 gap-4 text-[14px]">
              <div>
                <label className="block mb-1"><strong>Name:</strong></label>
                <input
                  type="text"
                  name="Current_User_Name"
                  value={updatedUser.Current_User_Name}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Email:</strong></label>
                <input
                  type="email"
                  name="Current_User_Email"
                  value={updatedUser.Current_User_Email}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Sim No:</strong></label>
                <input
                  type="text"
                  name="SIM_No"
                  value={updatedUser.SIM_No}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Previous User:</strong></label>
                <input
                  type="text"
                  name="Previous_User"
                  value={updatedUser.Previous_User}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Location:</strong></label>
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
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
              <div>
                <label className="block mb-1"><strong>Mode:</strong></label>
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
                <label className="block mb-1"><strong>GLPL Remark:</strong></label>
                <select
                  name="Remark"
                  value={updatedUser.Remark}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select a Remark</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="In Stock">In stock</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block mb-1"><strong>Vi Status:</strong></label>
                <select
                  name="Vi_Status"
                  value={updatedUser.Vi_Status}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="">Select a Remark</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="In Stock">In stock</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block mb-1"><strong>Asset Mapping:</strong></label>
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
                <label className="block mb-1"><strong>Department:</strong></label>
                <input
                  type="text"
                  name="Department"
                  value={updatedUser.Department}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Designation:</strong></label>
                <input
                  type="text"
                  name="Designation"
                  value={updatedUser.Designation || ''}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Reporting Manager:</strong></label>
                <input
                  type="text"
                  name="Reporting_Manager"
                  value={updatedUser.Reporting_Manager}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
              <div>
                <label className="block mb-1"><strong>Manager Email:</strong></label>
                <input
                  type="text"
                  name="Manager_Email"
                  value={updatedUser.Manager_Email}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleUpdateClick} className="bg-glpl-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Update
              </button>
              <button onClick={() => setEditModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded ml-2 hover:bg-gray-400 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Email Modal */}
      {isApprovalModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50 ">
          <div className="bg-white p-5 rounded-lg shadow-lg w-[800px]">
            <h2 className="text-xl font-semibold mb-4">Send Approval Email</h2>
            <input
              type="text"
              name="month"
              value={approvalEmailData.month}
              onChange={handleApprovalEmailInputChange}
              placeholder="Month"
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="name"
              value={displayUser.Current_User_Name}
              onChange={handleApprovalEmailInputChange}
              placeholder="Name"
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="reporting_manager"
              value={displayUser.Reporting_Manager}
              onChange={handleApprovalEmailInputChange}
              placeholder="Reporting Manager"
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="planname"
              value={displayUser.PlanName}
              onChange={handleApprovalEmailInputChange}
              placeholder="Plan Name"
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="base"
              value={displayUser.Cost}
              onChange={handleApprovalEmailInputChange}
              placeholder="Base"
              className="border border-gray-300 p-2 mb-2 w-full"
            />
            <input
              type="text"
              name="isd_minutes"
              value={displayUser.isd_minutes}
              onChange={handleApprovalEmailInputChange}
              placeholder="ISD Minutes"
              className="border border-gray-300 p-2 mb-4 w-full"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
                onClick={() => setIsApprovalModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
                onClick={handleApprovalEmailSubmit}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserDetails;