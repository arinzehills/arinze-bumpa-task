import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RedirectState {
  redirectUrl: string | null;
  setRedirectUrl: (url: string) => void;
  clearRedirectUrl: () => void;
}

export const useRedirectStore = create<RedirectState>()(
  persist(
    (set) => ({
      redirectUrl: null,
      setRedirectUrl: (url) => set({ redirectUrl: url }),
      clearRedirectUrl: () => set({ redirectUrl: null }),
    }),
    {
      name: "redirect-url",
    }
  )
);