import React, { useEffect, useState } from 'react';
import Header from './partials/navbar';
import { DASHBOARD_API_END_POINT, UPLOAD_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from "sonner";
//help in fetching student data , dynamic table me display krna and delete functionality plus upload student data and updating class
const Students = () => {
  //state to manage form data , students list and modal visibility
  const [formData, setFormData] = useState({
    cid: "",
    fullname: "",
    enrollment_no: ""
  });
  const [students, setStudents] = useState([]);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [actionUrl, setActionUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
 

   //Fetch students data on component mount
   useEffect(()=>{
    const fetchStudents = async() => {
      try{
      const response = await axios.get(`${DASHBOARD_API_END_POINT}/getstudents`,
          {withCredentials:true}
        );
        const data = response.data;
        setStudents(data.students || []);
    } catch(error){
      setErrorMessage('Failed to fetch students');
    }
  };
    fetchStudents();
  },[]);
   

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Store selected file in state
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);  // Log form data
    // Handle form submission
    try {
      const response = await axios.post(`${DASHBOARD_API_END_POINT}/addstudents`, formData, {
        headers: {
        'Content-Type': 'application/json'
      },
        withCredentials: true}
    );

      if (response.data.message === 'success') {
        toast.success(response.data.message);
      }

        //Update the ui by adding the new class to the state
        setStudents([...students, response.data.student]);

       //clear the form
       setFormData({ 
        cid: "", 
        fullname:"", 
        enrollment_no: "" 
      });

      } catch (error) {
      setErrorMessage('Failed to add student');
      
    }
  }
  
  //Handle deleting a student
  const handleDelete = async(studentId) => {
    try{
    const response = await axios.delete(`${DASHBOARD_API_END_POINT}/deletestudents/${studentId}`, 
      {withCredentials:true}
    );

    if(response.data.success){
      setStudents(students.filter((student) => student._id !== studentId));
      toast.success(response.data.message);
    }
  } catch(error){
    setErrorMessage('Failed to delete student');
  } 
  };

  //Open file modal for upload or update
  const openFileModal = (action) => {
    setActionUrl(action === 'upload' ? "/excel/uploadstudent" : "/excel/updateclass");
    setFileModalVisible(true);
  };

  //Close the modal
  const closeFileModal = () => {
    setFileModalVisible(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Append the selected file to formData

    try {
      const response = await axios.post(`${UPLOAD_API_END_POINT}/${actionUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      toast.success(response.data.message); // Show success message
      closeFileModal(); // Close the modal after upload
    } catch (error) {
      setErrorMessage('Failed to upload file');
    }
  };

  return (
    <>
    <Header/>
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Form */}
      <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg mt-20">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Class ID:</label>
            <input
              type="text"
              name="cid"
              value={formData.cid}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter class id"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Full Name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Enrollment No:</label>
            <input
              type="text"
              name="enrollment_no"
              value={formData.enrollment_no}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter Enrollment No"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Student</button>
            <a href="/dashboard" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4">Go Back</a>
          </div>
        </form>
      </div>

      {/* Upload and Update Section */}
      <div className="flex justify-center mt-6">
        <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => openFileModal('upload')}>Upload File</button>
        <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => openFileModal('update')}>Update Class Info</button>
      </div>

      {/* Table */}
      <div className="mt-10 max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">NO.</th>
              <th className="px-4 py-2">Class ID</th>
              <th className="px-4 py-2">Enrollment No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Populate rows dynamically here */}
            {students.map((student, index) => 
            student ? (
                <tr key={student._id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{student.class_id}</td>
                  <td className="px-4 py-2">{student._id}</td>
                  <td className="px-4 py-2">{student.fullname}</td>
                  <td className="px-4 py-2">
                    <button className="text-red-500" onClick={() => handleDelete(student._id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
            </tr>
             ) : null  // Handle undefined case
              )}
          </tbody>
        </table>
      </div>

      {/* File Upload Modal */}
      {fileModalVisible && (
      <div className=" fixed z-10 inset-0 overflow-y-auto" id="fileModal">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload File</h2>
              <span className="cursor-pointer text-xl" onClick={closeFileModal}>&times;</span>
            </div>
            <form onSubmit={handleFileUpload}>
              <input
                type="file"
                name="csv"
                accept="text/csv"
                onChange={handleFileChange} // This handles file selection
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4">Upload</button>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
      <div className=" fixed z-10 inset-0 overflow-y-auto" id="errorModal">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-100 p-6 rounded-lg shadow-lg">
            <p className="text-center text-red-600 font-bold">{errorMessage}</p>
            <button type="button" className="text-red-600 font-bold text-xl"  onClick={() => setErrorMessage('')}>&times;</button>
          </div>
        </div>
      </div>
      )};
    </div>
    </>
  );
};

export default Students;
