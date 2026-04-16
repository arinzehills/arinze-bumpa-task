import { useEffect } from "react";
import { useAuthStore, User } from "@app/stores/useAuthStore";
import { useGet } from "./useGet";

export const useRefreshUserInfo = () => {
  const { setUser } = useAuthStore();
  const { data: userData, isLoading, refetch } = useGet<User>("/auth/me", {
    autoFetch: true,
    cacheDuration: 0  // Disable cache to always fetch fresh data
  });

  // Automatically update user store when data fetches
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return { isLoading, refetch };
};