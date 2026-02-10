import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext.jsx";

export default function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;

  }

  return children;
}
