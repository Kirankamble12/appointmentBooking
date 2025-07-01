import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import "react-toastify/dist/ReactToastify.css";

export const AddTeacher = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    image: null, // ✅ Changed from profileImg to image
    name: "",
    gender: "",
    dob: "",
    qualification: "",
    department: "",
    subject: "",
    email: "",
    mobile: "",
    password: "",
    conpassword: "", // ✅ Changed from confirmPassword to conpassword
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.conpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await fetch("http://localhost:4000/api/admin/add-teacher", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Teacher added successfully!");
        setTimeout(() => {
          navigate("/admin-dashbord"); // ✅ Corrected path
        }, 2000);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
       console.error("Error submitting form:", error);
     toast.error("Failed to submit form. Please try again later.");
    }
  
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Add Teacher</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ✅ Image Upload Section (First) */}
        <div className="flex flex-col items-center">
          {formData.image && (
            <img 
              src={URL.createObjectURL(formData.image)} 
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover shadow-lg shadow-violet-500 mb-3"
            />
          )}
          <label className="block text-gray-700 font-medium">Upload Profile Image</label>
          <input type="file" name="image" onChange={handleFileChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md"/>
        </div>

        {/* ✅ Name */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Name"/>
        </div>

        {/* ✅ Gender & DOB */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md"/>
          </div>
        </div>

        {/* ✅ Qualification & Department */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Qualification</label>
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Qualification"/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Department"/>
          </div>
        </div>

        {/* ✅ Subject */}
        <div>
          <label className="block text-gray-700 font-medium">Subject</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Subject"/>
        </div>

        {/* ✅ Email & Mobile */}
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Email"/>
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Mobile Number</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Mobile Number"/>
        </div>

        {/* ✅ Password & Conpassword */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Enter Password"/>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Confirm Password</label>
            <input type="password" name="conpassword" value={formData.conpassword} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg shadow-md" placeholder="Confirm Password"/>
          </div>
        </div>

        <button type="submit" className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 transition-all shadow-lg shadow-violet-500 font-bold text-lg">
          Add Teacher
        </button>
      </form>
    </div>
  );
};
