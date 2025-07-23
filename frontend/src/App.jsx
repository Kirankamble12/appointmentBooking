import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import Toastify container
import "react-toastify/dist/ReactToastify.css"
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import { ContactUs } from "./Components/ContactUs";
import { AdminLogin } from "./admin/AdminLogin";
import { AdminRegister } from "./admin/AdminRegister";
import { AddTeacher } from "./admin/AddTeacher";
import { ManageTeacher } from "./admin/ManageTeacher";
import { ApproveStudent } from "./admin/ApproveStudent";
import { AdminDashbord } from './admin/AdminDashbord';
import { AdminProfile } from "./admin/AdminProfile";
import { TeacherLogin } from "./teacher/TeacherLogin";
import { TeacherDashboard } from "./teacher/TeacherDashboard";
import { ScheduleAppointment } from "./teacher/ScheduleAppointment ";
import { ManageAppointments } from "./teacher/ManageAppointments";
import { AllAppointments } from "./teacher/AllAppointments";
import { ViewMessages } from "./teacher/ViewMessages";
import { StudentLogin } from "./Student/StudentLogin";
import { StudentRegister } from "./Student/StudentRegister";
import { BookAppointment } from "./Student/BookAppointment";
import {SendMessages} from "./Student/SendMessages";
import {ForgotPassword} from "./Student/ForgotPassword";
import { StudentDashbord } from "./Student/StudentDashbord";
import { StudentProfile } from "./Student/StudentProfile";
import MyAppointments from "./Student/MyAppointments";
import { ViewAllAppointment } from "./teacher/ViewAllAppointment";
import { TeacherProfile } from "./teacher/TeacherProfile";
import  ForgotPass from "./teacher/ForgotPass";






const App = () => {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar is always visible */}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Loads Home on start */}
        <Route path="/contactus" element={<ContactUs />} /> {/* ✅ Loads Contact Us when clicked */}
                  {/*Admin pages */}
        <Route path ="/admin-login" element={<AdminLogin/>}/>
        <Route path="/admin-registration" element={<AdminRegister/>}/>
        <Route path="/add-teacher" element={<AddTeacher/>}/>
        <Route path="/manage-teacher" element={<ManageTeacher/>}/>
        <Route path="/approve-student" element={<ApproveStudent />}/>
        
        <Route path="/admin-dashbord" element={<AdminDashbord/>}/>
        <Route path="/admin-profile" element={<AdminProfile/>}/>
                  {/*Teacher pages */}
        <Route path="/teacher-login" element={<TeacherLogin/>}/>
        <Route path="/teacher-dashboard" element={<TeacherDashboard/>}/>
        <Route path="/schedule-appointment" element={<ScheduleAppointment/>}/>
        <Route path="/manage-appointment" element={<ManageAppointments/>}/>
        <Route path="/appointments/:teacherEmail" element={<AllAppointments/>}/>
        <Route path="/view-messages/:teacherEmail" element={<ViewMessages />} /> 
        <Route path="/view-appontment" element={<ViewAllAppointment/>}/> 
        <Route path="/teacher-profile" element={<TeacherProfile/>}/>
        <Route path="/forgot-pass" element={<ForgotPass/>}/>
        


         {/*Student Pages */}
        <Route path="/student-login" element={<StudentLogin/>}/>
        <Route path="/student-register" element={<StudentRegister/>}/>
        <Route path="/student-dashbord" element={<StudentDashbord/>}/>
        <Route path="/student-profile" element={<StudentProfile/>}/>
        <Route path="/book-appointment/:email" element={<BookAppointment/>}/>
        <Route path="/send-message" element={<SendMessages/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/my-appointments" element ={<MyAppointments/>}/>
      </Routes>
      
    </Router>
  );
};

export default App;
