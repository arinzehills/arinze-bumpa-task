import { Route } from "react-router-dom";
import {
  DashboardLayout,
  type SidebarLink,
} from "@components/layouts/DashboardLayout";
import UserDashboard from "@modules/user-dashboard/UserDashboard";
import { ProtectedRoute } from "./ProtectedRoute";

const userSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "ph:chart-line-up",
  },
  {
    name: "Achievements",
    url: "/dashboard/achievements",
    icon: "ph:trophy",
  },
  {
    name: "Profile",
    url: "/dashboard/profile",
    icon: "ph:user",
  },
];

export const UserRoutes = () => (
  <>
    <Route path="/dashboard/*" element={<ProtectedRoute />}>
      <Route
        element={
          <DashboardLayout sidebarLinks={userSidebarLinks} isAdmin={false} />
        }
      >
        <Route index element={<UserDashboard />} />
        <Route
          path="achievements"
          element={<div>Achievements</div>}
        />
        <Route path="profile" element={<div>Profile</div>} />
      </Route>
    </Route>
  </>
);
