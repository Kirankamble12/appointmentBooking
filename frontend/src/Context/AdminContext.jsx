import { createContext, useState } from "react";

const AdminContext = createContext(); // ✅ Creates admin context

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const loginAdmin = (adminData) => {
    setAdmin(adminData); // ✅ Stores admin data in state
  };

  const logoutAdmin = () => {
    setAdmin(null); // ✅ Clears authentication state
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext }; // ✅ Only exporting context
