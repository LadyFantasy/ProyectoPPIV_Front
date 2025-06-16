// /context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const superAdmin = localStorage.getItem("isSuperAdmin");
    if (token) {
      setIsAuthenticated(true);
      setIsSuperAdmin(superAdmin === "1");
    }
    setLoading(false);
  }, []);

  const login = async (token, username, superAdmin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("isSuperAdmin", superAdmin);
    setIsAuthenticated(true);
    setIsSuperAdmin(superAdmin === "1");
    // Disparar un evento de storage para notificar a otros componentes
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isSuperAdmin");
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    // Disparar un evento de storage para notificar a otros componentes
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isSuperAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
