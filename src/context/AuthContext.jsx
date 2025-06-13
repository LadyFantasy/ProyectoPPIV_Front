// /context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const superAdmin = localStorage.getItem("isSuperAdmin") === "true";
    if (token) {
      setIsAuthenticated(true);
      setIsSuperAdmin(superAdmin);
    }
    setLoading(false);
  }, []);

  const login = (token, username, superAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("isSuperAdmin", superAdmin);
    setIsAuthenticated(true);
    setIsSuperAdmin(superAdmin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isSuperAdmin");
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isSuperAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
