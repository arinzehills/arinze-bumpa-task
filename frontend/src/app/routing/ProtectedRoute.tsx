import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";

import { SideToast } from "@components/Toast";
import { useAuthStore } from "@app/stores/useAuthStore";
import { useAppModeStore } from "@app/stores/useAppModeStore";

export const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAuthStore();
  const { setMode } = useAppModeStore();

  // Set app mode to 'user' when accessing user routes
  useEffect(() => {
    setMode("user");
  }, [setMode]);

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    SideToast.FireWarning({
      title: "Authentication Required",
      message: "Please login to access this page",
    });
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
