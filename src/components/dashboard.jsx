import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";


const Dashboard = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  //for logout the profile
 const logoutHandler = async () => {
  
  try {
    //Api call process
      const response = await axios.get(`${ADMIN_API_END_POINT}/logout`, { 
        withCredentials: true 
      });

      if (response.data.success) {
          navigate("/admin");//navigate to home page
          toast.success(response.data.message);
      }
  } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
  }
}

const toggleDropdown = () => {
  setDropdownOpen(!isDropdownOpen);
};

  return (
    <div>
      <header className="bg-gray-100 p-4 fixed w-full z-10 shadow-md top-0">
        <nav className="flex justify-between items-center max-w-screen-xl mx-auto ">
          <div>
            <p className="text-xl font-bold">DASHBOARD</p>
          </div>
          <button className="block md:hidden focus:outline-none">
            <span className="text-2xl">&#9776;</span>
          </button>
          <div className="hidden md:flex space-x-4">
            <div className="relative">
              <button onClick={toggleDropdown} className="hover:underline focus:outline-none pr-5">Manage</button>
              {isDropdownOpen && (
                <div className="absolute bg-white shadow-lg rounded mt-2">
                  <Link to="/dashboard/students" className="block px-4 py-2 hover:bg-gray-200">Manage Students</Link>
                  <Link to="/dashboard/classes" className="block px-4 py-2 hover:bg-gray-200">Manage Classes</Link>
                  <Link to="/dashboard/results" className="block px-4 py-2 hover:bg-gray-200">Manage Results</Link>
                </div>
              )}
            </div>
            <span className="hover:underline cursor-pointer" onClick={logoutHandler}>Log Out</span>
          </div>
        </nav>
      </header>

      <section className="m-20 p-20">
        <div className="flex flex-wrap justify-center items-center gap-10">
          {/* Manage Students */}
          <div className="w-72 shadow-lg rounded-lg bg-white">
            <img
              className="rounded-t-lg"
              src="https://raw.githubusercontent.com/YashJain2409/ResultManagementSystem/255cd5d4afb3cc8fef30780ddf98c24b3474d952/public/assets/dashboard_student.svg"
              alt="Manage Students"
            />
            <div className="p-6">
              <Link to="Students" className="block bg-gray-800 text-white py-2 text-center rounded hover:bg-gray-900">
                <i className="fas fa-users"></i> Manage Students
              </Link>
            </div>
          </div>

          {/* Manage Classes */}
          <div className="w-72 shadow-lg rounded-lg bg-white">
            <img
              className="rounded-t-lg"
              src="https://raw.githubusercontent.com/YashJain2409/ResultManagementSystem/255cd5d4afb3cc8fef30780ddf98c24b3474d952/public/assets/dashboard_class.svg"
              alt="Manage Classes"
            />
            <div className="p-6">
              <Link to="/dashboard/classes" className="block bg-gray-800 text-white py-2 text-center rounded hover:bg-gray-900">
                <i className="fas fa-landmark"></i> Manage Classes
              </Link>
            </div>
          </div>

          {/* Manage Results */}
          <div className="w-72 shadow-lg rounded-lg bg-white">
            <img
              className="rounded-t-lg"
              src="https://raw.githubusercontent.com/YashJain2409/ResultManagementSystem/255cd5d4afb3cc8fef30780ddf98c24b3474d952/public/assets/dashboard_result.svg"
              alt="Manage Results"
            />
            <div className="p-6">
              <Link to="/dashboard/results" className="block bg-gray-800 text-white py-2 text-center rounded hover:bg-gray-900">
                <i className="fas fa-square-poll-vertical"></i> Manage Results
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
