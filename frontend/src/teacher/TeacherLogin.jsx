import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TeacherLogin = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("🚨 All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/teacher/teacher-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (!data.success) {
        toast.error("❌ " + data.message);
      } else {
        console.log("Backend Login Response:", data);

        toast.success("✅ Login successful! Redirecting...");

        // ✅ Store teacher data & token
        localStorage.setItem("teacherData", JSON.stringify(data.teacher));
        localStorage.setItem("teacherToken", data.token);

        console.log("Stored Teacher Data:", JSON.parse(localStorage.getItem("teacherData")));

          
        setTimeout(() => navigate("/teacher-dashboard"), 2000); // ✅ Redirect
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("⚠️ Failed to login. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Teacher Login</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* ✅ Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg shadow-md"
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
            className="w-full p-3 border border-violet-400 rounded-lg shadow-md"
            placeholder="Enter Password"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 shadow-lg font-bold text-lg"
        >
          Login as Teacher
        </button>
      </form>

      {/* ✅ Additional Links */}
      <div className="mt-4 text-center text-gray-600">
        <p>Don't have an account? <Link to="/teacher-register" className="text-violet-700 font-bold hover:underline">Register here</Link></p>
        <p><Link to="/forgot-pass" className="text-violet-700 font-bold hover:underline">Forgot Password?</Link></p>
      </div>
    </div>
  );
};
