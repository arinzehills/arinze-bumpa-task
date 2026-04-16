import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type AppMode = 'user' | 'admin'

interface AppModeStore {
  mode: AppMode
  setMode: (mode: AppMode) => void
}

export const useAppModeStore = create<AppModeStore>()(
  persist(
    (set) => ({
      mode: 'user',
      setMode: (mode: AppMode) => set({ mode }),
    }),
    {
      name: 'app-mode',
      storage: createJSONStorage(() => sessionStorage), // Tab-specific storage, survives refresh
    }
  )
)