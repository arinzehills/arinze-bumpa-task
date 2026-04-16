import { Route } from "react-router-dom";
import {
  DashboardLayout,
  type SidebarLink,
} from "@components/layouts/DashboardLayout";
import UserDashboard from "@modules/user-dashboard/UserDashboard";
import AchievementsPage from "@modules/user-dashboard/pages/Achievements";
import Profile from "@modules/user-dashboard/pages/Profile";
import { ProtectedRoute } from "./ProtectedRoute";
import PartnersStoreList from "@modules/landing/components/PartnersStoreList";

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
    name: "Shop From Partners",
    url: "/dashboard/partners",
    icon: "mdi:partnership",
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
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="partners" element={<PartnersStoreList />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
  </>
);
