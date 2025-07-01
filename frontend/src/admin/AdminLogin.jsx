import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

export const AdminLogin = () => {
  const navigate = useNavigate(); // Initialize navigation

  const [formData, setFormData] = useState({
    adminid: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Basic validation
    if (!formData.adminid || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      //  Simulate API call (replace with actual backend authentication)
      const response = await fetch("http://localhost:4000/api/admin/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!data.success) {
        toast.error("Error: " + data.message);
    } else {
        toast.success("Login successful! Redirecting...");
    
        // ✅ Store admin data in localStorage
        localStorage.setItem("adminData", JSON.stringify(data.admin)); 
    
        setTimeout(() => {
            navigate("/admin-dashbord"); // Redirect after success
        }, 2000);
    }
    
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Failed to login. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Admin Login</h2>

      {/* Decorative Separator */}
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium">Admin ID</label>
          <input 
            type="text" 
            name="adminid" 
            value={formData.adminid} 
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md" 
            placeholder="Enter Admin ID"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md" 
            placeholder="Enter Email"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Password</label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md" 
            placeholder="Enter Password"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 transition-all shadow-lg shadow-violet-500 font-bold text-lg"
        >
          Login as Admin
        </button>
      </form>

      {/* 🔹 Add Admin Registration Link Below the Form */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">Don't have an account?</p>
        <Link 
          to="/admin-registration" 
          className="text-violet-700 font-bold hover:underline"
        >
          Register as Admin
        </Link>
      </div>
    </div>
  );
};
