import React, { useState, useEffect } from "react";

export const ViewAllAppointment = () => {
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);

  useEffect(() => {
    const fetchConfirmedAppointments = async () => {
      try {
        const storedTeacher = JSON.parse(localStorage.getItem("teacherData"));
        if (!storedTeacher?.email) {
          console.error("Error: Teacher email not found in local storage!");
          return;
        }

        // ✅ Fetch all appointments for the teacher
        const response = await fetch(`http://localhost:4000/api/teacher/confirmed-appointments/${storedTeacher.email}`);
        const data = await response.json();

        if (data.success) {
          //  Filter appointments:
          // - Student-scheduled (Confirmed)
          // - Teacher-scheduled (Automatically Confirmed)
          const confirmed = data.appointments.filter(appt => appt.status === "Confirmed");
          setConfirmedAppointments(confirmed);
        } else {
          console.error("Failed to fetch appointments.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchConfirmedAppointments();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700"> My All Appointments</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {confirmedAppointments.length === 0 ? (
        <p className="text-center text-gray-600">No confirmed appointments found.</p>
      ) : (
        <div className="space-y-4">
          {confirmedAppointments.map((appointment) => (
            <div key={`${appointment.studentEmail}-${appointment.date}-${appointment.time}`} className="p-4 border border-violet-400 rounded-lg shadow-md">
              <p className="text-lg font-bold text-violet-700">{appointment.studentEmail}</p>
              <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(appointment.date).toISOString().split("T")[0]}</p>
              <p className="text-sm text-gray-600"><strong>Time:</strong> {appointment.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllAppointment;
