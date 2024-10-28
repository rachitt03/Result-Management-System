import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './partials/navbar';
import axios from 'axios';
import { RESULTS_API_END_POINT } from '@/utils/constant';


const StudentResultSearch = () => {
  // State for form inputs
  const [enrollmentNo, setEnrollmentNo] = useState('');
  // Include sem and branch inputs in the form
  const [sem, setSem] = useState('');
  const [branch, setBranch] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API call

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (enrollmentNo.trim() === '' || sem.trim() === '' || branch.trim() === '') {
      setErrorMessage('All fields are required');
      return;
    }

    try{
      setLoading(true); // Start loading
      setErrorMessage(''); // Clear previous errors
      
      console.log("Sending request with:", { enrollment_no: enrollmentNo, sem, branch });

      // Make API call to your backend to get the result
      const response = await axios.get(`${RESULTS_API_END_POINT}/resultstudent`,{ 
        params: { enrollment_no: enrollmentNo, sem, branch},
        withCredentials: true
      });
      
      // Check the response and navigate to the results page if success
      if (response.data.success) {
       
        console.log("Result data:", response.data.result);
        // Navigate to the result page and pass the result as a query param
        navigate('/student/results',{
            state: { 
              result: response.data.result,
              fullname: response.data.result.fullname , // Assuming this is returned
              enrollment_no: enrollmentNo,
              studentSem: sem,
              studentBranch: branch,  
            }
        });
      } else {
        setErrorMessage('No result found for this enrollment number.');
      }
    } catch (error) {
      console.error("Error fetching result:", error.response ? error.response.data : error.message);

      setErrorMessage('An error occurred while fetching the result. Please try again later.');
    } finally {
      setLoading(false); // End loading
    }
  };
    
  // Check if there is an error in the URL params (like ?error=No%20data%20found)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setErrorMessage(decodeURIComponent(errorParam)); // Decode URL encoding
    }
  }, []);

  return (
    <>
    <Header />
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md p-6">
        <img src="https://github.com/YashJain2409/ResultManagementSystem/blob/main/public/assets/result.png?raw=true" alt="Result Search" className="mx-auto" />
        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="inputEnrollment" className="block text-sm font-semibold text-gray-700">Enrollment No.</label>
            <input
              type="text"
              id="inputEnrollment"
              name="enrollment_no"
              value={enrollmentNo}
              onChange={(e) => setEnrollmentNo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <small className="block mt-1 text-gray-500">Search your results by entering your enrolment no.</small>
          </div>
          
          {/* Semester Input */}
          <div className="mb-4">
            <label htmlFor="inputSem" className="block text-sm font-semibold text-gray-700">Semester</label>
            <input
              type="text"
              id="inputSem"
              name="sem"
              value={sem}
              onChange={(e) => setSem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

            {/* Branch Input */}
            <div className="mb-4">
              <label htmlFor="inputBranch" className="block text-sm font-semibold text-gray-700">Branch</label>
              <input
                type="text"
                id="inputBranch"
                name="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

          <button type="submit" className="w-full py-2 mt-4 text-white bg-gray-800 rounded hover:bg-gray-700" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-4 text-sm text-yellow-700 bg-yellow-200 border-l-4 border-yellow-500 rounded">
            <p className="text-center">{errorMessage}</p>
          </div>
        )}
      </div>
    </main>
    </>
  );

};
export default StudentResultSearch;
