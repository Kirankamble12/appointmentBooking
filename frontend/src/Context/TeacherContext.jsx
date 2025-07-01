import { createContext, useState } from "react";

const TeacherContext = createContext(); // ✅ Creates teacher context

export const TeacherProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);

  const loginTeacher = (teacherData) => {
    setTeacher(teacherData); // ✅ Stores teacher data in state
  };

  const logoutTeacher = () => {
    setTeacher(null); // ✅ Clears authentication state
  };

  return (
    <TeacherContext.Provider value={{ teacher, loginTeacher, logoutTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
};

export { TeacherContext }; // ✅ Only exporting context
