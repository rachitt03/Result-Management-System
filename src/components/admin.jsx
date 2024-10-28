import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "./partials/navbar";
import axios from 'axios';
import { ADMIN_API_END_POINT } from '@/utils/constant';

const Admin = () => {
  const [username, setUsername] = useState('');//abhi state is empty
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      setErrorMessage('Please fill in all fields.');
      setShowAlert(true);
      return;
    }


    try{
      setErrorMessage(''); // Clear previous errors
      console.log("Request Data:", { username, password });

      // Make API call to your backend to get the admin information
      const response = await axios.post(`${ADMIN_API_END_POINT}/login`,{
        username, password 
      },{withCredentials: true}
      );

      // Check the response and navigate to the results page if success
      if (response.data.success) {
        console.log("Admin data:", response.data);
         // Redirect to the dashboard
         navigate('/dashboard');
    } else {
      // Handle login failure
      setErrorMessage(response.data.message || 'Login failed.');
      setShowAlert(true);
    }
  }catch(error){
    console.error("Error:", error.response ? error.response.data : error.message);
    setErrorMessage(error.response?.data?.message || 'An error occurred.'); // Show specific error message
    setShowAlert(true);
  }
};

  return (
    <>
    <Header navLink="Home"/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src="https://github.com/YashJain2409/ResultManagementSystem/blob/main/public/assets/admin.png?raw=true" alt="Admin" className="w-36 h-36 mb-6"/>
  
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 shadow-lg rounded-lg" autoComplete="off">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inputUsername">User Name</label>
          <input
            type="text"
            id="inputUsername"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="inputPassword">
            Password
          </label>
          <input
            type="password"
            id="inputPassword"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          Login
          </button>
        </div>
      </form>

      {showAlert && (
        <div className="mt-4 w-full max-w-sm">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
            <p className="font-bold">Warning</p>
            <p>{errorMessage}</p>
            <button className="text-sm text-gray-500 mt-2 underline" onClick={() => setShowAlert(false)}>Close</button>
          </div>
        </div>
      )}

          {/* New section for "Sign up" */}
          <div className="mt-6">
          <p className="text-gray-700">
            Don't have an account? 
            <Link to="/register-admin" className="text-blue-500 hover:text-blue-700 ml-1">Sign up here</Link>
          </p>
        </div>
    </div>
    </>
  );
};

export default Admin;
