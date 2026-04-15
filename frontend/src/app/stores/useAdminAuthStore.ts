import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin'
}

interface AdminAuthStore {
  user: AdminUser | null
  token: string | null
  isAuthenticated: boolean

  login: (user: AdminUser, token: string) => void
  logout: () => void
  setToken: (token: string) => void
  setUser: (user: AdminUser) => void
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