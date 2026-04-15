import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role?: 'user' | 'admin'
  total_points?: number
  current_badge_id?: string | null
  current_badge_name?: string | null
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  isAdmin: () => boolean
  isUser: () => boolean

  login: (user: User, token: string) => void
  logout: () => void
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      isAdmin: () => get().user?.role === 'admin',
      isUser: () => get().user?.role === 'user' || !get().user?.role,

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
      name: 'auth-storage',
    }
  )
)