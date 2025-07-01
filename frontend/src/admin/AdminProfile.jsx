import React, { useEffect, useState } from "react";

export const AdminProfile = () => {
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminData")); // ✅ Fetch stored admin object
    if (storedAdmin) {
      setAdmin(storedAdmin);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Admin Profile</h2>
      
      <div className="w-32 h-1 mx-auto my-4 bg-violet-700 rounded-full"></div>

      {/* Profile Details */}
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <img 
          src={admin.image || "https://www.w3schools.com/w3images/avatar2.png"} 
          alt="Admin Profile"
          className="w-32 h-32 rounded-full object-cover shadow-lg"
        />

        {/* Admin Info */}
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold text-gray-800">ID: {admin.adminid}</p>
          <p className="text-lg font-semibold text-gray-800">Name: {admin.name}</p>
          <p className="text-lg font-semibold text-gray-800">Email: {admin.email}</p>
          <p className="text-lg font-semibold text-gray-800">Mobile: {admin.mob || "Not Available"}</p>
        </div>
      </div>
    </div>
  );
};
