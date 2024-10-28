import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./partials/navbar";
import axios from "axios";
import { DASHBOARD_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const ManageClasses = () => {
  //used useState()
  const [formData, setFormData] = useState({
    cid: "",
    branch: "",
    semester: "",
    subjects: "",
  });

  // Add state to manage modal visibility , classes and subjects
  const [isModalOpen, setIsModalOpen] = useState(false); // Set to false if you want the modal hidden initially
  const [classes, setClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before submission:", formData); // Add this log
    try {
      //Send the form data to the backend
      const response = await axios.post(`${DASHBOARD_API_END_POINT}/addclasses`, formData,
        { withCredentials: true }
      );

      if(response.data.success){
        toast.success(response.data.message);
      }

      //Update the ui by adding the new class to the state
      setClasses([...classes, response.data.class]);

      //clear the form
      setFormData({
        cid: "",
        branch: "",
        semester: "",
        subjects: "",
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  //Fetch classes data from the server ya backend
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${DASHBOARD_API_END_POINT}/getclasses`,
        { withCredentials: true }
      );

      const data = response.data; //Directly use response.data for axios ya hm ese bhi likh skte the response.data.classes
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  //Function to handle class deletion
  const handleDeleteClass = async(classId) => {
    try {
      const response = await axios.delete(`${DASHBOARD_API_END_POINT}/deleteclasses/${classId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchClasses(); // refresh the classes list
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  //Function to open modal with subjects
  const openModal = (subjects) => {
    setSelectedSubjects(subjects);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    //fetch class data on component mount
    fetchClasses();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto mt-20 p-4 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Class id:
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500"
              placeholder="Class id"
              name="cid"
              value={formData.cid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Branch
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500"
              placeholder="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Semester
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500"
              placeholder="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Subjects
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-500"
              placeholder="Enter subjects"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              required
            />
            <small className="text-gray-500">(Comma separated)</small>
          </div>

          <div className="flex items-center space-x-4">
            <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700">Add Class</button>
            <Link to="/dashboard" className="border border-gray-800 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100">Go Back</Link>
          </div>
        </form>

        <div className="mt-16">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-300 px-4 py-2">NO.</th>
                <th className="border border-gray-300 px-4 py-2">Class ID</th>
                <th className="border border-gray-300 px-4 py-2">Branch</th>
                <th className="border border-gray-300 px-4 py-2">Semester</th>
                <th className="border border-gray-300 px-4 py-2">Subjects</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Add logic to populate table rows here */}
              {classes.map((classItem, index) =>
                classItem ? (
                  <tr key={classItem._id}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{classItem._id}</td>
                    <td className="border border-gray-300 px-4 py-2">{classItem.branch}</td>
                    <td className="border border-gray-300 px-4 py-2">{classItem.semester}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button className="btn btn-dark" onClick={() => openModal(classItem.subjects)}>View Subjects</button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className="text-red-700 cursor-pointer ml-4" onClick={() => handleDeleteClass(classItem._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </td>
                  </tr>
                ) : null // Handle undefined case
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Logic */}
        {isModalOpen && (
          <div id="myModal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Subjects</h2>
                <span className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={closeModal}>&times;</span>
              </div>
              <div id="subjects">
                {/* Modal content for subjects */}
                <ol className="list-group list-group-flush">
                  {selectedSubjects.map((subject, index) => (
                    <li key={index} className="list-group-item">
                      {subject}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageClasses;
