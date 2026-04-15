import { Navigate, Outlet } from "react-router-dom";
import { SideToast } from "@components/Toast";
import { useAuthStore } from "@app/stores/useAuthStore";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated) {
    SideToast.FireWarning({
      title: "Authentication Required",
      message: "Please login to access this page",
    });
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
