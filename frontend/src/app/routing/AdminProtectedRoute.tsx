import { Navigate, Outlet } from "react-router-dom";

import { SideToast } from "@components/Toast";
import { useAdminAuthStore } from "@app/stores/useAdminAuthStore";

export const AdminProtectedRoute = () => {
  const { isAuthenticated, user } = useAdminAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated) {
    SideToast.FireWarning({
      title: "Authentication Required",
      message: "Please login as admin to access this page",
    });
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user is admin
  if (user?.role !== "admin") {
    SideToast.FireWarning({
      title: "Access Denied",
      message: "Admin access required to view this page",
    });
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
