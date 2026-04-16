import { useAppModeStore } from '../useAppModeStore'

describe('useAppModeStore', () => {
  beforeEach(() => {
    useAppModeStore.setState({ mode: 'user' })
  })

  describe('Initial State', () => {
    it('should start with user mode', () => {
      const store = useAppModeStore.getState()
      expect(store.mode).toBe('user')
    })
  })

  describe('setMode()', () => {
    it('should change mode to admin', () => {
      useAppModeStore.getState().setMode('admin')
      expect(useAppModeStore.getState().mode).toBe('admin')
    })

    it('should change mode back to user', () => {
      useAppModeStore.getState().setMode('admin')
      useAppModeStore.getState().setMode('user')
      expect(useAppModeStore.getState().mode).toBe('user')
    })

    it('should support multiple mode switches', () => {
      useAppModeStore.getState().setMode('admin')
      expect(useAppModeStore.getState().mode).toBe('admin')

      useAppModeStore.getState().setMode('user')
      expect(useAppModeStore.getState().mode).toBe('user')

      useAppModeStore.getState().setMode('admin')
      expect(useAppModeStore.getState().mode).toBe('admin')
    })
  })
})