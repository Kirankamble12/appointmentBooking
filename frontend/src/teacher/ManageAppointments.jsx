import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaUser } from "react-icons/fa";

const mockAppointments = [
  { id: 1, student: "Adarsh", date: "2025-04-25", time: "10:00 AM", status: "Pending" },
  { id: 2, student: "Rahul", date: "2025-04-26", time: "12:30 PM", status: "Pending" },
];

export const ManageAppointments = () => {
  const [appointments, setAppointments] = useState(mockAppointments);

  // Handle Approve Action
  const handleApprove = (id) => {
    setAppointments(appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status: "Approved" } : appointment
    ));
  };

  // Handle Cancel Action
  const handleCancel = (id) => {
    setAppointments(appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status: "Canceled" } : appointment
    ));
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-violet-700">Manage Appointments</h2>

      {/* Decorative Separator */}
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* Appointment List */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-4 border border-violet-400 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{appointment.student}</h3>
              <p className="text-sm text-gray-600">
                <FaCalendarAlt className="inline text-violet-700 mr-2" /> {appointment.date} @ {appointment.time}
              </p>
              <p className={`text-sm font-bold ${appointment.status === "Approved" ? "text-green-600" : appointment.status === "Canceled" ? "text-red-600" : "text-yellow-500"}`}>
                Status: {appointment.status}
              </p>
            </div>

            {/* Action Buttons */}
            {appointment.status === "Pending" && (
              <div className="space-x-2">
                <button 
                  onClick={() => handleApprove(appointment.id)} 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all flex items-center space-x-2"
                >
                  <FaCheckCircle /> <span>Approve</span>
                </button>

                <button 
                  onClick={() => handleCancel(appointment.id)} 
                  className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all flex items-center space-x-2"
                >
                  <FaTimesCircle /> <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
