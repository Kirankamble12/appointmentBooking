import React, { useEffect, useState } from "react";
import { FaUser, FaCalendarAlt, FaEnvelope, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const teacherEmail = teacher?.email;

  useEffect(() => {
    const storedTeacher = JSON.parse(localStorage.getItem("teacherData"));
    if (storedTeacher) {
      setTeacher(storedTeacher);
    }
  }, []);

  console.log("Retrieved Teacher Email in Dashboard:", teacherEmail); 

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full sm:w-64 bg-white shadow-2xl shadow-violet-500 p-6 flex flex-col items-center md:block">
        <img 
          src={teacher?.image && teacher.image.startsWith("http") ? teacher.image : "https://www.w3schools.com/w3images/avatar2.png"} 
          alt="Teacher Profile"
          onError={(e) => e.target.src = "https://www.w3schools.com/w3images/avatar2.png"}
          className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto block shadow-md shadow-violet-400"
        />
        <p className="text-violet-700 font-bold mt-3 text-sm md:text-base">{teacher?.email || "teacher@example.com"}</p>

        <Link to="/teacher-profile" className="bg-violet-700 text-white p-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 transition-all mt-4 w-auto">
          <FaUser />
          <span>View Profile</span>
        </Link>

        <button 
          className="bg-violet-700 text-white p-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 transition-all mt-4 w-full md:w-auto"
          onClick={() => {
            localStorage.removeItem("teacherData");
            window.location.href = "/";
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-violet-700">Teacher Dashboard</h2>
        <div className="w-32 h-1 mx-auto my-4 bg-violet-700 rounded-full"></div>

        {/* Menu Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 sm:mt-10">
          {/* 🔹 Schedule Appointment */}
          <Link to="/schedule-appointment" className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaCalendarAlt className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">Schedule Appointment</p>
          </Link>

          {/* 🔹 View Messages */}
          <Link to={`/view-messages/${teacherEmail}`} className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaEnvelope className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">View Messages</p>
          </Link>

          {/* 🔹 Approve/Cancel Appointments */}
          <Link to={`/appointments/${teacherEmail}`} className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaClipboardList className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">Approve/Cancel Appointment</p>
          </Link>

          {/* 🔹 View All Appointments (NEW) */}
          <Link to="/view-appontment" className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaCalendarAlt className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">View All Appointments</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
