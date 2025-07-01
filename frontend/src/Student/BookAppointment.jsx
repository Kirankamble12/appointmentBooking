import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const BookAppointment = () => {
  const [teacher, setTeacher] = useState(null);
  const [formData, setFormData] = useState({
    studentEmail: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    // ✅ Get Student & Teacher Details from Local Storage
    const storedStudent = JSON.parse(localStorage.getItem("studentData"));
    const storedTeacher = JSON.parse(localStorage.getItem("selectedTeacher"));

    if (storedStudent && storedTeacher) {
      setTeacher(storedTeacher);
      setFormData((prev) => ({
        ...prev,
        studentEmail: storedStudent.email,
      }));
    } else {
      toast.error("Error fetching teacher or student data.");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Appointment Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        studentEmail: formData.studentEmail,  // ✅ Explicitly add student email
        teacherEmail: teacher.email,  // ✅ Explicitly add teacher email
        date: formData.date,
        time: formData.time,
      };

      const response = await fetch(`http://localhost:4000/api/student/book-appointment/${teacher.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody), // ✅ Send all required fields
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (data.success) {
        toast.success("Appointment booked successfully!");
        setFormData({ ...formData, date: "", time: "" }); // ✅ Clear Form
      } else {
        toast.error(data.message || "Failed to book appointment.");
      }
    } catch (err) {
      console.error("Error booking appointment:", err.message);
      toast.error("Error booking appointment! Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />

      <h2 className="text-3xl font-bold text-center text-violet-700">Book Appointment</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* ✅ Display Teacher's Details */}
      {teacher && (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-bold text-violet-700">{teacher.name}</h3>
          <p className="text-gray-600"><strong>Email:</strong> {teacher.email}</p>
          <p className="text-gray-600"><strong>Department:</strong> {teacher.department}</p>
          <p className="text-gray-600"><strong>Subject:</strong> {teacher.subject}</p>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <div>
          <label className="block text-gray-700 font-medium">Date</label>
          <input 
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg shadow-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Time</label>
          <input 
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full p-3 border border-violet-400 rounded-lg shadow-md"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-violet-700 text-white p-3 rounded-full hover:bg-violet-800 transition-all shadow-lg font-bold text-lg"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
