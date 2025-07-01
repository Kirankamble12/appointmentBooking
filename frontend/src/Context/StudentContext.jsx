import { createContext, useState } from "react";

const StudentContext = createContext(); // ✅ Creates student context

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  const registerStudent = (studentData) => {
    setStudent(studentData); // ✅ Stores registered student data in state
  };

  const loginStudent = (studentData) => {
    setStudent(studentData); // ✅ Stores student authentication session
  };

  const logoutStudent = () => {
    setStudent(null); // ✅ Clears authentication state
  };

  return (
    <StudentContext.Provider value={{ student, registerStudent, loginStudent, logoutStudent }}>
      {children}
    </StudentContext.Provider>
  );
};

export { StudentContext }; // ✅ Only exporting context
