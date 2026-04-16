import { useEffect } from "react";
import { useAuthStore } from "@app/stores/useAuthStore";
import { useGet } from "./useGet";

interface User {
  id: string;
  email: string;
  name: string;
  total_points?: number;
  current_badge_id?: string | null;
  current_badge_name?: string | null;
}

export const useRefreshUserInfo = () => {
  const { setUser } = useAuthStore();
  const { data: userData, isLoading } = useGet<{ user: User }>("/auth/me", {
    autoFetch: true
  });

  // Automatically update user store when data fetches
  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    }
  }, [userData, setUser]);

  return { isLoading, userData: userData?.user };
};