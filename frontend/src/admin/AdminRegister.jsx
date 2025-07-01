import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

export const AdminRegister = () => {
  const navigate = useNavigate(); // Initialize navigation

  const [formData, setFormData] = useState({
    adminid: "",
    name: "",
    email: "",
    mob: "",
    password: "",
    conpassword: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Preview before upload

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      setSelectedFile(file); // Store actual file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewImage(reader.result); // Store Base64 string for preview
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.adminid || !formData.name || !formData.email || !formData.mob || !formData.password || !formData.conpassword) {
      toast.error("All fields are required!");
      return;
    }

    if (formData.password !== formData.conpassword) {
      toast.warning("Passwords do not match!");
      return;
    }

    if (!selectedFile) {
      toast.error("Please upload an image!");
      return;
    }

    console.log("Selected File Before Upload:", selectedFile);

    // Prepare FormData to send both text fields & image
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("image", selectedFile); // Append image file

    try {
      const response = await fetch("http://localhost:4000/api/admin/add-admin", {
        method: "POST",
        body: formDataToSend // Send FormData instead of JSON
      });

      const data = await response.json();
      console.log("Response from Backend:", data);

      if (!data.success) {
        toast.error("Error: " + data.message);
      } else {
        toast.success("Admin registered successfully!");
        setTimeout(() => {
          navigate("/admin-login"); // Redirect to login page after success
        }, 2000); // Delay for better user experience
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again later.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Admin Registration</h2>

      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium">Admin ID</label>
          <input type="text" name="adminid" value={formData.adminid} onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full shadow-md" placeholder="Enter Admin ID" required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full shadow-md" placeholder="Enter Name" required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email ID</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full shadow-md" placeholder="Enter Email ID" required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Mobile Number</label>
          <input type="tel" name="mob" value={formData.mob} onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full shadow-md" placeholder="Enter Mobile Number" required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full shadow-md" placeholder="Enter Password" required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Confirm Password</label>
          <input type="password" name="conpassword" value={formData.conpassword} onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-full shadow-md" placeholder="Confirm Password" required
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-gray-700 font-medium">Upload Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 border border-violet-400 rounded-full shadow-md" required/>
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div className="mt-3 text-center">
            <img src={previewImage} alt="Profile Preview" className="w-32 h-32 mx-auto rounded-full shadow-md border border-violet-400" />
          </div>
        )}

        <button type="submit" className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 transition-all shadow-lg shadow-violet-500 font-bold text-lg">
          Register as Admin
        </button>
      </form>
    </div>
  );
};
