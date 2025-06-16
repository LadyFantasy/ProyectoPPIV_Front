import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function SuperAdminRoute({ children }) {
  const { isAuthenticated, loading, isSuperAdmin } = useAuth();
  const [localIsSuperAdmin, setLocalIsSuperAdmin] = useState(false);

  useEffect(() => {
    const superAdmin = localStorage.getItem("isSuperAdmin") === "1";
    setLocalIsSuperAdmin(superAdmin);
  }, []);

  if (loading) return null;

  return isAuthenticated && (isSuperAdmin || localIsSuperAdmin) ? (
    children
  ) : (
    <Navigate to="/admin" replace />
  );
}
