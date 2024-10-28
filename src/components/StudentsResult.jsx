import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { RESULTS_API_END_POINT } from "@/utils/constant";

const StudentResult = () => {
  const location = useLocation();
  const { result, fullname, enrollment_no, studentSem, studentBranch } = location.state || {};  // Destructure state from location
  const [semester, setSemester] = useState(studentSem || 1);
  const [resultData, setResultData] = useState(result || null); // Set result data directly
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(result === null); // Disable based on initial result

  useEffect(() => {
    // Calculate status and percentage if resultData changes
    if (resultData) {
      calculateStatusAndPercentage(resultData);
    }
  }, [resultData]);
 
  useEffect(() => {
    console.log("Updated resultData: ", resultData);
  }, [resultData]);

  const handleSemesterClick = (sem) => {
    setSemester(sem);
    fetchResults(sem);
  };

  const fetchResults = async (sem) => {
    setIsLoading(true);
    setSearchClicked(true);

    try {
      const response = await axios.get(`${RESULTS_API_END_POINT}/resultstudent/`, {
        params: { enrollment_no, sem, branch: studentBranch },
        withCredentials: true // include cookies for authentication
      });
      console.log(response.data);
      const json = response.data;
      setResultData(Array.isArray(json.result.marks) ? json.result.marks : []);
      calculateStatusAndPercentage(json.result.marks);
    } catch (error) {
      console.error("Error fetching the results:", error);
      setIsLoading(false);
    }
  };

  const calculateStatusAndPercentage = (results) => {
    if (!Array.isArray(results) || results.length === 0) {
      setPercentage(0);
      setStatus("No results");
      return;
    }
    
    let totalMarks=0;
    let sum = 0;
    let isPassed = true;
    results.forEach((item) => {
      const maxMarks = 70; // Assuming 70 is the max for each subject, adjust if needed
      totalMarks += maxMarks;
      const score = Number(item.score); 
    console.log('Current Score:', score); // Log each score
      sum += score;
      if (score < 28) isPassed = false;
    });
    const calculatedPercentage = ((sum / totalMarks) * 100).toFixed(2);
    console.log("Calculated Percentage:" , {calculatedPercentage});
    setPercentage(calculatedPercentage);
    setStatus(isPassed ? "Pass" : "Fail");
  };
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <header>
        <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">RESULT MANAGEMENT</h1>
              <ul className="flex space-x-4">
                <li>
                  <a className="text-blue-500 hover:underline" href="/student">Home</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="mt-24 px-4">
        <section className="mt-8">
          <div className="container mx-auto">
            <p className="text-lg">Name: {fullname}</p>
            <p className="text-lg">Enrollment Number: <span>{enrollment_no}</span></p>
            <p className="text-lg">Semester: <span>{studentSem}</span></p>
            <p className="text-lg">Branch: <span>{studentBranch}</span></p>
          </div>

          <div className="container mx-auto mt-4">
            <p className="inline-block text-lg">Select Semester</p>
            <div className="relative inline-block">
              <button className="bg-gray-800 text-white px-4 ml-4 py-2 rounded focus:outline-none">Sem - {semester}</button>
              <div className="absolute bg-white z-10">
                {[...Array(studentSem).keys()].map((sem) => (
                  <p
                    key={sem}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleSemesterClick(sem + 1)}
                  >
                    Sem - {sem + 1}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="container mx-auto mt-4">
            <button
              className="border border-gray-800 text-gray-800 py-2 px-4 ml-30 rounded hover:bg-gray-100"
              onClick={() => fetchResults(semester)}
              disabled={searchDisabled || isLoading}
            >
              {isLoading ? "Loading..." : "Search"}
            </button>
          </div>

          {searchClicked && (
            <div className="container mx-auto mt-10" id="table-container">
              {resultData && resultData.length > 0 ? (
                <>
                  <table id="result-table" className="table table-hover min-w-full mt-10">
                    <thead className="thead-dark">
                      <tr>
                      <th className="w-1/12 px-4 py-2 text-center border">NO.</th>
                      <th className="w-6/12 px-4 py-2 text-left border">SUBJECTS</th>
                      <th className="w-3/12 px-4 py-2 text-center border">MARKS</th>
                      <th className="w-2/12 px-4 py-2 text-center border">OUT OF</th>
                      </tr>
                     </thead>
                    <tbody>
                    {resultData.map((item, index) => (
                   <tr key={index} className="border-t">
                   <td className="px-4 py-2 text-center border">{index + 1}</td>
                   <td className="px-4 py-2 text-left border">{item.name}</td>
                  <td
                  className={`px-4 py-2 text-center border ${
                    item.score < 28 ? "text-red-500" : ""
                  }`}
                >
                  {item.score}
                </td>
                <td className="px-4 py-2 text-center border">70</td>
              </tr>
            ))}
                    </tbody>
                  </table>

                  <div id="status" className="container mt-10 text-center">
                    <p className="font-bold text-right">Percentage: {percentage}%</p>
                    <p className={`text-white text-center py-2 ${status === "Pass" ? "bg-green-500" : "bg-red-500"}`}>
                      Status: {status}
                    </p>
                  </div>

                  <button
                    id="print-button"
                    className="border border-gray-800 text-gray-800 py-2 px-4 rounded mt-4 hover:bg-gray-100 print:hidden"
                    onClick={handlePrint}
                  >
                    Print Result
                  </button>
                </>
              ) : (
                <p id="initial" className="text-center text-gray-400 mt-4">
                  ---No data found---
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentResult;
