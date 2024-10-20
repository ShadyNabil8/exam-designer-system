import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { token, user } = isAuthenticated();

  return token && user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
