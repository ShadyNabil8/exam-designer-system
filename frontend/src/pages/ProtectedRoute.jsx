import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { token, user } = isAuthenticated();

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }

    if (user && !user?.isVerified) {
      navigate("/verify-email");
    }
  }, [token, user]);

  return <Outlet />;
};

export default ProtectedRoute;
