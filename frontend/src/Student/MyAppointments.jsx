import React, { useState, useEffect } from "react";

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentData"));
    if (storedStudent?.email) {
      fetchAppointments(storedStudent.email);
    }
  }, []);

  const fetchAppointments = async (email) => {
    try {
      const response = await fetch(`http://localhost:4000/api/student/my-appointments/${email}`);
      const data = await response.json();

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        console.error("Failed to fetch appointments.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-violet-700">My Appointments</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {appointments.length === 0 ? (
        <p className="text-center text-gray-600">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
              <p className="text-violet-700 font-bold">Teacher: {appt.teacherName} ({appt.teacherEmail})</p>
              <p className="text-gray-600"><strong>Department:</strong> {appt.department}</p>
              <p className="text-gray-600"><strong>Subject:</strong> {appt.subject}</p>
              <p className="text-gray-600"><strong>Date:</strong> {appt.date}</p>
              <p className="text-gray-600"><strong>Time:</strong> {appt.time}</p>
              <p className={`font-bold ${appt.status === "Confirmed" ? "text-green-600" : appt.status === "Cancelled" ? "text-red-600" : "text-yellow-600"}`}>
                Status: {appt.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
