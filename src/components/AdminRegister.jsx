import React, { useState } from 'react';
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';
import Header from './partials/navbar';
import { useNavigate } from 'react-router-dom';
const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${ADMIN_API_END_POINT}/register`, { 
        username, password},
        {withCredentials:true}
    );
      
      if (response.data.success) {
        navigate("/admin")
        setMessage("Admin registered successfully!");
        setErrorMessage('');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <>
    <Header/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Register Admin</h2>

      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 shadow-lg rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
            Register
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-4 w-full max-w-sm">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
            <p>{message}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 w-full max-w-sm">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminRegister;
