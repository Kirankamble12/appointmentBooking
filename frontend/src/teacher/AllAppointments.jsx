import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaUser, FaClock, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const storedTeacher = JSON.parse(localStorage.getItem("teacherData"));

        if (!storedTeacher?.email) {
          toast.error("Error: Teacher email not found in local storage!");
          return;
        }

        const response = await fetch(`http://localhost:4000/api/teacher/appointments/${storedTeacher.email}`);
        const data = await response.json();

        if (data.success) {
          setAppointments(data.appointments);
        } else {
          toast.error("Failed to fetch appointments.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
        toast.error("Error fetching appointments. Please try again.");
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (studentEmail, date, time, newStatus) => {
    try {
      const storedTeacher = JSON.parse(localStorage.getItem("teacherData"));
      if (!storedTeacher?.email) {
        toast.error("Error: Teacher email not found in local storage!");
        return;
      }

      const formattedDate = new Date(date).toISOString().split("T")[0]; // ✅ Ensure date format

      const requestData = { studentEmail, date: formattedDate, time, status: newStatus };
      console.log("Sending Request:", requestData);

      const response = await fetch(`http://localhost:4000/api/teacher/appointments/${storedTeacher.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) =>
            appt.studentEmail === studentEmail &&
            appt.date === formattedDate &&
            appt.time === time
              ? { ...appt, status: newStatus }
              : appt
          )
        );
        toast.success(`Appointment ${newStatus} successfully!`);
      } else {
        toast.error("Failed to update appointment status.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error.message);
      toast.error("Error updating appointment. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center text-violet-700">Approve or Reject Appointments</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={`${appointment.studentEmail}-${appointment.date}-${appointment.time}`} className="p-4 border border-violet-400 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center">
                  <FaUser className="text-violet-700 mr-2" /> {appointment.studentEmail}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaCalendarAlt className="inline text-violet-700 mr-2" /> {appointment.date}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaClock className="inline text-violet-700 mr-2" /> {appointment.time}
                </p>
                <p className={`text-sm font-bold ${appointment.status === "Confirmed" ? "text-green-600" : appointment.status === "Cancelled" ? "text-red-600" : "text-yellow-500"}`}>
                  Status: {appointment.status}
                </p>
              </div>

              {/* ✅ Approve & Reject Buttons - Turn Gray When Status is Updated */}
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-2 rounded-lg shadow-md transition-all ${
                    appointment.status === "Pending" ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`} 
                  onClick={() => handleUpdateStatus(appointment.studentEmail, appointment.date, appointment.time, "Confirmed")}
                  disabled={appointment.status !== "Pending"}
                >
                  <FaCheck /> Approve
                </button>

                <button 
                  className={`px-3 py-2 rounded-lg shadow-md transition-all ${
                    appointment.status === "Pending" ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`} 
                  onClick={() => handleUpdateStatus(appointment.studentEmail, appointment.date, appointment.time, "Cancelled")}
                  disabled={appointment.status !== "Pending"}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
