import React, { useState, useEffect } from "react";
import Header from "./partials/navbar";
import axios from "axios";
import { DASHBOARD_API_END_POINT , UPLOAD_API_END_POINT } from "@/utils/constant";

const Result = ({ classes }) => {
  const [classId, setClassId] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [resultModalContent, setResultModalContent] = useState(null);

  // Fetch results data from the server
  const fetchResults = async () => {
    try{
    const response = await axios.get(`${DASHBOARD_API_END_POINT}/getresults` , 
      {withCredentials:true}
    );
    
    const data =  response.data;
    setTableData(data.results || []);
  }catch(error){
    console.log(error);
  }
  };

   // Delete result function
   const deleteResult = async (rid) => {
    try {
      const response = await axios.delete(`${DASHBOARD_API_END_POINT}/deleteresults/${rid}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Result deleted successfully");
        fetchResults(); // Reload table after deletion
      } else {
        alert("Error deleting result");
      }
    } catch (error) {
      console.error("Error while deleting result:", error);
    }
  };


  // Handle class selection to dynamically load subjects
  const handleClassChange = async (e) => {
    setClassId(e.target.value);
    const cid = e.target.value;
    try{
    const response = await axios.get(`${DASHBOARD_API_END_POINT}/addresults/${cid}` , 
      {withCredentials:true}
    );
    const data = response.data;
    setSubjects(data.subjects || []);
  }catch(error){
    console.log(error);
  }
  };

  // Form submission
  const handleFormSubmit = async(e) => {
    e.preventDefault();

    try{
      const payload = {
        class_id:classId,
        enrollment_no:enrollmentNo,
        subjects: subjects.map((subject) => {
          return {
            name:subject,
            score:e.target[subject].value
          };
        }),
      };
      
      // Make the POST request to the backend API
      const response = await axios.post(`${DASHBOARD_API_END_POINT}/addresults`,
      payload,
      {withCredentials:true}
      );
      
      // Log the response from the backend to check for success
      console.log(response.data);
      
      // Reload the results table after adding the result
      fetchResults();
    }catch(error){
      console.log(error);
    }
  };

  // Handle file upload
  const handleFileSubmit = async(e) => {
    e.preventDefault();
    console.log("File submitted", selectedFile);

    if (!selectedFile || selectedFile.type !== 'text/csv') {
      alert('Please upload a valid CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try{
    const response = await axios.post(`${UPLOAD_API_END_POINT}/excel/uploadresult`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    toast.success(response.data.message); // Show success message
    closeFileModal(); // Close the modal after upload
  } catch (error) {
    console.log(error);
  }
};
  

  // Show results in modal
  const handleShowResults = (result) => {
    setResultModalContent(result);
    setModalVisible(true);
  };

  // Handle file selection for upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Fetch results table on component mount
  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <>
      <Header />
      <div className="p-10 mt-20 min-h-screen">
        <div className="bg-white p-6 shadow-md rounded-md">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-semibold">Select Class Id</label>
              <input
                className="border rounded-md p-2 w-full"
                value={classId}
                onChange={handleClassChange}
                required
              />
              </div>  
          
    

            {subjects.length > 0 && (
              <div id="subjects">
                {subjects.map((subject, idx) => (
                  <div key={idx} className="form-group row">
                    <label className="col-sm-2 col-form-label">
                      {subject}
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="number"
                        name={subject}
                        placeholder="Enter marks"
                        className="form-control"
                        min={0}
                        max={70}
                        required
                        onKeyDown={(e) => {
                          if (
                            ["e", ".", "+", "-"].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-semibold">
                Enrollment No
              </label>
              <input
                type="text"
                className="border rounded-md p-2 w-full"
                placeholder="Enter enrollment no"
                value={enrollmentNo}
                onChange={(e) => setEnrollmentNo(e.target.value)}
                required
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="bg-black text-white py-2 px-4 rounded-md">Add Result</button>
              <a href="/dashboard" className="bg-gray-200 text-black py-2 px-4 rounded-md">Go Back</a>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-white p-6 shadow-md rounded-md">
          <button
            className="bg-black text-white py-2 px-4 rounded-md"
            onClick={() => setFileModalVisible(true)}
          >
            Upload File
          </button>
        </div>

        <div className="container mx-auto mt-10">
          <table className="min-w-full bg-white ">
            <thead className="bg-gray-800 text-white ">
              <tr>
                <th className="py-2 px-4">NO.</th>
                <th className="py-2 px-4">Enrollment No</th>
                <th className="py-2 px-4">Class Id</th>
                <th className="py-2 px-4">Results</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{data.student_id}</td>
                  <td className="py-2 px-4">{data.class_id}</td>
                  <td className="py-2 px-4">
                    <button
                      className="btn btn-dark"
                      onClick={() => handleShowResults(data.result)}
                    >
                      See result
                    </button>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className="cursor-pointer"
                      onClick={() => deleteResult(data._id)} // Calling delete function
                      >
                        
                    
                      <i className="fa-solid fa-trash"></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Result</h2>
                <button onClick={() => setModalVisible(false)} className="text-black">
                  &times;
                </button>
              </div>
              <div className="mt-4">
                {resultModalContent && (
                  <ol className="list-group">
                    {resultModalContent.map((item, idx) => (
                      <li key={idx} className="list-group-item">
                        {item.name}: {item.score}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        )}

        {fileModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Upload File</h2>
                <button
                  onClick={() => setFileModalVisible(false)}
                  className="text-black"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleFileSubmit} className="mt-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border p-2 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 mt-4 rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Result;
