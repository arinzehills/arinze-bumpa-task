import { Route } from "react-router-dom";
import { AdminProtectedRoute } from "./AdminProtectedRoute";
import {
  DashboardLayout,
  type SidebarLink,
} from "@components/layouts/DashboardLayout";
import { AdminDashboard } from "@modules/admin/pages/dashboard/AdminDashboard";
import { UsersManagement } from "@modules/admin/pages/users-management/UsersManagement";

const adminSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    url: "/admin",
    icon: "ph:chart-line-up",
  },
  {
    name: "Users",
    url: "/admin/users",
    icon: "ph:users",
  },
];

export const AdminRoutes = () => (
  <>
    <Route element={<AdminProtectedRoute />}>
      <Route
        element={
          <DashboardLayout sidebarLinks={adminSidebarLinks} isAdmin={true} />
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
      </Route>
    </Route>
  </>
);
