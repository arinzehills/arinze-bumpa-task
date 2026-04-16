import { create } from 'zustand'

interface UnlockedItem {
  name: string
  description: string
  type: 'achievement' | 'badge'
}

interface CelebrationStore {
  isOpen: boolean
  items: UnlockedItem[]
  open: (items: UnlockedItem[]) => void
  close: () => void
}

export const useCelebrationStore = create<CelebrationStore>((set) => ({
  isOpen: false,
  items: [],
  open: (items: UnlockedItem[]) =>
    set({
      isOpen: true,
      items,
    }),
  close: () =>
    set({
      isOpen: false,
      items: [],
    }),
}))