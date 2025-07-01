import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const StudentRegister = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    gender: "",
    dob: "",
    department: "",
    year: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // ✅ Preview before upload

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setPreviewImage(reader.result);
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("🚨 Please upload a profile image!");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    formDataToSend.append("profileImage", selectedFile); // ✅ Append image file

    try {
      const response = await fetch("http://localhost:4000/api/student/student-register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("✅ Student registered successfully!");
        setTimeout(() => navigate("/student-login"), 2000); // ✅ Redirect to login
      } else {
        toast.error("❌ " + data.message);
      }
    } catch (error) {
      toast.error("⚠️ Registration failed, try again!");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-violet-700">Student Registration</h2>
        <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            {previewImage && (
              <img src={previewImage} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover shadow-lg shadow-violet-500 mb-3"/>
            )}
            <label className="block text-gray-700 font-medium">Upload Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md"/>
          </div>

          {/* Student Details */}
          <div>
            <label className="block text-gray-700 font-medium">Student ID</label>
            <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Student ID"/>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Full Name"/>
          </div>

          {/* Gender & Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md"/>
            </div>
          </div>

          {/* Department & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Department"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Year</label>
              <select name="year" value={formData.year} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md">
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          {/* Email & Password */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Email"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Password"/>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Confirm Password"/>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 transition-all shadow-lg shadow-violet-500 font-bold text-lg">
            Register as Student
          </button>
        </form>
      </div>
    </div>
  );
};
