"use client"
import React, { useState } from 'react';

const EmailModal = ({ isOpen, onClose, userData }) => {
  const [formData, setFormData] = useState({
    Current_User_Name: userData?.Current_User_Name || '',
    Cell_no: userData?.Cell_no || '',
    dataUsage: userData?.dataUsage || '',
    Current_User_Email: userData?.Current_User_Email || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log(formData);
    onClose(); // Close modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Send 90% Email</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="cellNo"
          value={formData.cellNo}
          onChange={handleChange}
          placeholder="Cell Number"
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <input
          type="text"
          name="dataUsage"
          value={formData.dataUsage}
          onChange={handleChange}
          placeholder="Data Usage"
          className="border border-gray-300 p-2 mb-2 w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-300 p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-glpl-red hover:bg-red-800 text-white rounded-md"
            onClick={handleSubmit}
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
