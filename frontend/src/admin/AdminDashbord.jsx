import React, { useEffect, useState } from "react";
import { FaUser, FaClipboardList, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const AdminDashbord = () => {
  // ✅ State to store admin details
  const [admin, setAdmin] = useState({ email: "", image: "" });

  // ✅ Load admin details on mount (FETCH FROM LOCAL STORAGE)
  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminData")); // ✅ Fetch stored admin object

    console.log("Stored Admin Data:", storedAdmin); // ✅ Debugging output to check the data

    if (storedAdmin) {
      setAdmin(storedAdmin); // ✅ Set state with stored admin data
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="w-full sm:w-64 bg-white shadow-2xl shadow-violet-500 p-6 flex flex-col items-center md:block">
        {/* ✅ Dynamic Profile Image */}
        <img 
          src={admin.image || "https://www.w3schools.com/w3images/avatar2.png"} // ✅ Use MongoDB image or default
          alt="Admin Profile"
          className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto block shadow-md shadow-violet-400"
        />

        {/* ✅ Dynamic Email ID */}
        <p className="text-violet-700 font-bold mt-3 text-sm md:text-base">{admin.email || "admin@example.com"}</p>

        {/* View Profile Button */}
        <Link to="/admin-profile" className="bg-violet-700 text-white p-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 transition-all mt-4 w-auto">
         <FaUser />
         <span>View Profile</span>
        </Link>

        {/* Logout Button */}
        <button 
          className="bg-violet-700 text-white p-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 transition-all mt-4 w-full md:w-auto"
          onClick={() => {
            localStorage.removeItem("adminData"); // ✅ Clear session
            window.location.href = "/admin-login"; // ✅ Redirect to login
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-10 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-violet-700">Admin Dashboard</h2>
        <div className="w-32 h-1 mx-auto my-4 bg-violet-700 rounded-full"></div>

        {/* Menu Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 sm:mt-10">
          {/* 🔹 Add Teacher */}
          <Link to="/add-teacher" className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaUser className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">Add Teacher</p>
          </Link>

          {/* 🔹 Manage Teacher Info */}
          <Link to="/manage-teacher" className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaClipboardList className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">Manage Teacher Info</p>
          </Link>

          {/* 🔹 Approve Registered Students */}
          <Link to="/approve-student" className="bg-white p-4 sm:p-6 rounded-lg shadow-md shadow-violet-500 flex items-center space-x-4 hover:shadow-lg transition-all cursor-pointer">
            <FaCheckCircle className="text-violet-700 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg font-bold text-violet-700">Approve Registered Students</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
