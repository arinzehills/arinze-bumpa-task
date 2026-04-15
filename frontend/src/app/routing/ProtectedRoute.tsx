import { Navigate } from "react-router-dom";
import { SideToast } from "@components/Toast";
import { useAuthStore } from "@app/stores/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "user" | "admin";
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // Check if user is authenticated
  if (requireAuth && !isAuthenticated) {
    SideToast.FireWarning({
      title: "Authentication Required",
      message: "Please login to access this page",
    });
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requireRole && user?.role !== requireRole) {
    SideToast.FireWarning({
      title: "Access Denied",
      message: `This page is only for ${requireRole}s`,
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
