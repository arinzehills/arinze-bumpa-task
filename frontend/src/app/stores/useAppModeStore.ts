import { create } from 'zustand'

export type AppMode = 'user' | 'admin'

interface AppModeStore {
  mode: AppMode
  setMode: (mode: AppMode) => void
}

export const useAppModeStore = create<AppModeStore>((set) => ({
  mode: 'user',
  setMode: (mode: AppMode) => set({ mode }),
}))