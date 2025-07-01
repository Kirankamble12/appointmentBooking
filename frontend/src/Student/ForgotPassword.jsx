import React, { useState } from "react";

export const ForgotPassword = () => {
  const [formData, setFormData] = useState({ studentId: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4000/api/student/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: formData.studentId,
          email: formData.email,
          newPassword: formData.password
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert("Password reset successful! Please log in with your new password.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Forgot Password</h2>

      {/* Decorative Separator */}
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* Forgot Password Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Student ID Input */}
        <div>
          <label className="block text-gray-700 font-medium">Student ID</label>
          <input 
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md"
            placeholder="Enter Student ID"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md"
            placeholder="Enter Registered Email"
          />
        </div>

        {/* New Password Input */}
        <div>
          <label className="block text-gray-700 font-medium">New Password</label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md"
            placeholder="Enter New Password"
          />
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-gray-700 font-medium">Confirm Password</label>
          <input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 shadow-md"
            placeholder="Confirm New Password"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 transition-all shadow-lg shadow-violet-500 font-bold text-lg"
        >
          Reset Password
        </button>
      </form>

      {/* Additional Options */}
      <div className="text-center mt-4 text-gray-600">
        <p>Remember your password? <a href="/student-login" className="text-violet-700 font-bold hover:underline">Login here</a></p>
      </div>
    </div>
  );
};
