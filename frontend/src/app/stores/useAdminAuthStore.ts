import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from './useAuthStore'
import { useAppModeStore } from './useAppModeStore'



interface AdminAuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  login: (user: User, token: string) => void
  logout: () => void
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        // Reset app mode to user
        useAppModeStore.getState().setMode('user')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      setToken: (token) => {
        set({
          token,
        })
      },

      setUser: (user) => {
        set({ user })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
)