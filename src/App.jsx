import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/partials/navbar'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Admin from './components/admin';
import Dashboard from './components/dashboard';
import ManageClasses from './components/ManageClasses';
import Students from './components/ManageStudents'
import Result from './components/ManageResult';
import StudentResult from './components/StudentsResult';
import StudentResultSearch from './components/Student';
import AdminRegister from './components/adminRegister'

//setting up react-router-dom
const appsRouter = createBrowserRouter([
     {
      path:'/',
      element:<StudentResultSearch/>
     },
     {
      path:'/dashboard',
      element:<Dashboard/>
     },
     {
       path:'/dashboard/classes',
       element:<ManageClasses/>
     },
     {
       path:'/register-admin',
       element:<AdminRegister/>
     },
     {
      path:'/admin',
      element:<Admin/>
     },
     {
      path:'/dashboard/results',
      element:<Result/>
     },
     { 
      path:'/dashboard/students',
      element:<Students/>
     },
     {
      path:'/student/results',
      element:<StudentResult/>
     }
])


const App=() => {
  return(
    <div>
      <RouterProvider router = {appsRouter}/>
    </div>
  )
}
export default App;
