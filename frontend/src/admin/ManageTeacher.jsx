import React, { useState } from "react";

export const ManageTeacher = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    gender: "",
    dob: "",
    qualification: "",
    department: "",
    subject: "",
    email: "",
    mobile: "",
    password: "",
    conpassword: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/search-teacher?query=${searchInput}`);
      const data = await response.json();

      if (data.success && data.teacher) {
        setFormData({
          image: data.teacher.image,
          name: data.teacher.name,
          gender: data.teacher.gender,
          dob: data.teacher.dob.split("T")[0],
          qualification: data.teacher.qualification,
          department: data.teacher.department,
          subject: data.teacher.subject,
          email: data.teacher.email,
          mobile: data.teacher.mobile,
          password: "",
          conpassword: "",
        });
      } else {
        alert("Teacher not found!");
      }
    } catch (error) {
      console.error("Error searching teacher:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.conpassword) {
        alert("Passwords do not match!");
        return;
    }

    const formDataObject = new FormData();
    formDataObject.append("image", formData.image);  // ✅ Ensure image file is sent
    Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image") formDataObject.append(key, value);
    });

    try {
        const response = await fetch(`http://localhost:4000/api/admin/update-teacher/${formData.email}`, {
            method: "PATCH",
            body: formDataObject,
        });

        const data = await response.json();
        if (data.success) {
            alert("Teacher updated successfully!");
        } else {
            alert("Failed to update teacher!");
        }
    } catch (error) {
        console.error("Error updating teacher:", error);
    }
};


  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:4000/api/admin/delete-teacher/${formData.email}`, { method: "DELETE" });
        alert("Teacher deleted successfully!");
        setFormData({ image: null, name: "", gender: "", dob: "", qualification: "", department: "", subject: "", email: "", mobile: "", password: "", conpassword: "" });
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Manage Teacher</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      <div className="flex space-x-4 mb-6">
        <input 
          type="text"
          placeholder="Search by email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full p-3 border border-violet-400 rounded-lg"
        />
        <button 
          onClick={handleSearch}
          className="bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800"
        >
          Search
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        <div className="flex flex-col items-center">
          {formData.image && (
           <img 
           src={typeof formData.image === "string" && formData.image.startsWith("http") 
                 ? formData.image 
                 : formData.image ? URL.createObjectURL(formData.image) 
                 : "https://via.placeholder.com/150"}
           alt="Profile Preview"
           className="w-32 h-32 rounded-full object-cover shadow-lg shadow-violet-500 mb-3"
         />
          )}
          <label className="block text-gray-700 font-medium">Upload Profile Image</label>
          <input type="file" name="image" onChange={handleFileChange} className="w-full p-3 border border-violet-400 rounded-lg" />
        </div>

        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" className="w-full p-3 border border-violet-400 rounded-lg" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 border border-violet-400 rounded-lg" />
        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Enter Qualification" className="w-full p-3 border border-violet-400 rounded-lg" />
        <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Enter Department" className="w-full p-3 border border-violet-400 rounded-lg" />
        <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter Subject" className="w-full p-3 border border-violet-400 rounded-lg" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter New Password" className="w-full p-3 border border-violet-400 rounded-lg" />
        <input type="password" name="conpassword" value={formData.conpassword} onChange={handleChange} placeholder="Confirm New Password" className="w-full p-3 border border-violet-400 rounded-lg" />

        <div className="flex justify-between space-x-4">
          <button type="submit" className="w-full bg-violet-700 text-white p-3 rounded-lg hover:bg-violet-800">Update Teacher</button>
          <button type="button" onClick={handleDelete} className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700">Delete Teacher</button>
        </div>
      </form>
    </div>
  );
};
