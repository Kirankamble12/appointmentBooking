import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa"; // ✅ Import Close Icon
import { useNavigate } from "react-router-dom"; // ✅ Navigation

export const TeacherProfile = () => {
  const navigate = useNavigate(); // ✅ Navigation to previous page
  const [teacher, setTeacher] = useState({});

  // ✅ Load teacher details from localStorage on mount
  useEffect(() => {
    const storedTeacher = JSON.parse(localStorage.getItem("teacherData"));

    console.log("Stored Teacher Data:", storedTeacher); // ✅ Debugging output

    if (storedTeacher) {
      setTeacher(storedTeacher);
    }
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      {/* ✅ Close Button */}
      <button
        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
        onClick={() => navigate(-1)} // ✅ Go back to previous page
      >
        <FaTimes className="text-xl" />
      </button>

      <h2 className="text-3xl font-bold text-center text-violet-700">Teacher Profile</h2>
      <div className="w-32 h-1 mx-auto my-4 bg-violet-700 rounded-full"></div>

      {/* Profile Details in Table Format */}
      <div className="flex flex-col items-center">
        {/* ✅ Profile Image */}
        <img 
         src={teacher?.image && teacher.image.startsWith("http") ? teacher.image : "https://www.w3schools.com/w3images/avatar2.png"} 
 
          alt="Teacher Profile"
          className="w-32 h-32 rounded-full object-cover shadow-lg"
        />
        
        {/* ✅ Teacher Info Table (Approval Status & Teacher ID Removed) */}
        <table className="w-full mt-6 border border-gray-300 rounded-lg shadow-md">
          <tbody>
            <tr>
              <td className="p-3 border border-gray-300 font-semibold">Name</td>
              <td className="p-3 border border-gray-300">{teacher.name || "Not Available"}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300 font-semibold">Gender</td>
              <td className="p-3 border border-gray-300">{teacher.gender || "Not Available"}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300 font-semibold">Date of Birth</td>
              <td className="p-3 border border-gray-300">{teacher.dob || "Not Available"}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300 font-semibold">Department</td>
              <td className="p-3 border border-gray-300">{teacher.department || "Not Available"}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300 font-semibold">Subject</td>
              <td className="p-3 border border-gray-300">{teacher.subject || "Not Available"}</td>
            </tr>
            <tr>
              <td className="p-3 border border-gray-300 font-semibold">Email</td>
              <td className="p-3 border border-gray-300">{teacher.email || "Not Available"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherProfile;
