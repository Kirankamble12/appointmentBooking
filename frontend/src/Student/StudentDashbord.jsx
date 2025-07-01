import React, { useEffect, useState } from "react";
import { FaUser, FaSignOutAlt, FaSearch, FaEnvelope, FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

export const StudentDashbord = () => {
  const [student, setStudent] = useState({ email: "", profileImage: "" });
  const [searchEmail, setSearchEmail] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentData"));
    if (storedStudent) {
      setStudent(storedStudent);
    }
  }, []);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      setError("Please enter an email!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:4000/api/student/search-teacher?query=${encodeURIComponent(searchEmail)}`);
      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setTeacher(data.teacher);
      } else {
        setTeacher(null);
        setError("No teacher found with this email.");
      }
    } catch (err) {
      console.error("Error searching for teacher:", err);
      setLoading(false);
      setError("Error fetching teacher details.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="w-full sm:w-64 bg-white shadow-2xl shadow-violet-500 p-6 flex flex-col items-center">
        <img 
          src={student.profileImage && student.profileImage.startsWith("http") ? student.profileImage : "https://www.w3schools.com/w3images/avatar2.png"} 
          alt="Student Profile"
          className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto block shadow-md shadow-violet-400"
        />
        <p className="text-violet-700 font-bold mt-3">{student.email || "student@example.com"}</p>

        <Link to="/student-profile" className="bg-violet-700 text-white p-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 mt-4">
          <FaUser />
          <span>View Profile</span>
        </Link>

        <button 
          className="bg-violet-700 text-white p-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 mt-4 w-full"
          onClick={() => {
            localStorage.removeItem("studentData");
            window.location.href = "/student-login";
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex-1 p-6 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-violet-700">Student Dashboard</h2>
        <div className="w-32 h-1 mx-auto my-4 bg-violet-700 rounded-full"></div>

        {/* 🔍 Search Teacher Section */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 flex items-center space-x-4">
          <FaSearch className="text-violet-700 text-2xl"/>
          <input 
            type="email"
            placeholder="Search teacher by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full p-2 border border-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
          <button onClick={handleSearch} className="bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800">
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* ✅ Smaller "My Appointments" Box Below Search Bar */}
        <Link 
          to="/my-appointments"
          className="bg-white p-4 rounded-lg shadow-md shadow-violet-500 flex items-center justify-center hover:shadow-lg transition-all mt-6 w-full"
        >
          <FaCalendarCheck className="text-violet-700 text-xl" /> {/* ✅ Made icon smaller */}
          <span className="text-lg font-bold text-violet-700 ml-2">My Appointments</span> {/* ✅ Reduced font size */}
        </Link>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {teacher && (
          <div className="bg-white p-6 mt-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-violet-700">{teacher.name}</h3>
            <p className="text-gray-600"><strong>Email:</strong> {teacher.email}</p>
            <p className="text-gray-600"><strong>Department:</strong> {teacher.department}</p>
            <p className="text-gray-600"><strong>Subject:</strong> {teacher.subject}</p>

            {/* ✅ Actions: Store Teacher Data Before Navigation */}
            <div className="flex mt-4 space-x-4">
              <Link 
                to="/send-message" 
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-2 hover:shadow-lg transition-all"
                onClick={() => localStorage.setItem("selectedTeacher", JSON.stringify(teacher))}
              >
                <FaEnvelope className="text-violet-700 text-2xl" />
                <span className="text-base font-bold text-violet-700">Send Message</span>
              </Link>

              <Link 
                to={`/book-appointment/${teacher.email}`} 
                className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-2 hover:shadow-lg transition-all"
                onClick={() => localStorage.setItem("selectedTeacher", JSON.stringify(teacher))}
              >
                <FaCalendarAlt className="text-violet-700 text-2xl" />
                <span className="text-base font-bold text-violet-700">Schedule Appointment</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashbord;
