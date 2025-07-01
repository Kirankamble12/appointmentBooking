import React, { useEffect, useState } from "react";

export const ApproveStudent = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/approve-student");
        const data = await response.json();

        console.log("Fetched Students Data:", data.students);

        if (data.success) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const updateApprovalStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/approve-student/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: status }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === id ? { ...student, isApproved: status } : student
          )
        );
        alert(`Student ${status ? "approved" : "rejected"} successfully!`);
      } else {
        alert("Error updating approval status!");
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Approve Students</h2>
      
      <div className="space-y-6">
        {students.map((student) => (
          <div key={student._id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <img 
                src={student.profileImage || "https://www.w3schools.com/w3images/avatar2.png"} 
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <p className="text-lg font-bold text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-600">Email: {student.email}</p>
                <p className="text-sm text-gray-600">Mobile: {student.mobile}</p>
                <p className="text-sm text-gray-600">Gender: {student.gender}</p>
                <p className="text-sm text-gray-600">Student ID: {student.studentId}</p>
                <p className="text-sm text-gray-600">Department: {student.department}</p>
                <p className="text-sm text-gray-600">Year: {student.year}</p>
                <p className={`text-sm font-bold ${student.isApproved ? "text-green-600" : "text-yellow-500"}`}>
                  {student.isApproved ? "✅ Approved" : "🚨 Pending Approval"}
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => updateApprovalStatus(student._id, true)} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
              >
                Approve
              </button>
              <button 
                onClick={() => updateApprovalStatus(student._id, false)} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
