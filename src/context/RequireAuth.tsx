import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext.tsx";

export default function RequireAuth({ children }: {children: ReactNode}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // We cast state to keep the location object for redirection after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}