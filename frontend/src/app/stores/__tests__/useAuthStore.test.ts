import { useAuthStore } from '../useAuthStore'
import type { User } from '../useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useAuthStore.getState()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login()', () => {
    it('should set user and token on login', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        total_points: 100,
      }
      const mockToken = 'jwt-token-123'

      useAuthStore.getState().login(mockUser, mockToken)

      const store = useAuthStore.getState()
      expect(store.user).toEqual(mockUser)
      expect(store.token).toEqual(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should persist to localStorage', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      }
      const mockToken = 'jwt-token-123'

      useAuthStore.getState().login(mockUser, mockToken)

      const stored = JSON.parse(localStorage.getItem('auth-storage') || '{}')
      expect(stored.state.user).toEqual(mockUser)
      expect(stored.state.token).toEqual(mockToken)
    })
  })

  describe('logout()', () => {
    it('should clear user and token on logout', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }
      useAuthStore.getState().login(mockUser, 'token-123')
      useAuthStore.getState().logout()

      const store = useAuthStore.getState()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('setToken()', () => {
    it('should update token', () => {
      const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }
      useAuthStore.getState().login(mockUser, 'old-token')
      useAuthStore.getState().setToken('new-token')

      const store = useAuthStore.getState()
      expect(store.token).toBe('new-token')
      expect(store.user).toEqual(mockUser) // Should not affect user
    })
  })

  describe('setUser()', () => {
    it('should update user', () => {
      const initialUser: User = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }
      const updatedUser: User = {
        ...initialUser,
        total_points: 500,
      }

      useAuthStore.getState().login(initialUser, 'token')
      useAuthStore.getState().setUser(updatedUser)

      const store = useAuthStore.getState()
      expect(store.user).toEqual(updatedUser)
      expect(store.token).toBe('token') // Should not affect token
    })
  })

  describe('Helper methods', () => {
    it('isAdmin() should return true for admin role', () => {
      const adminUser: User = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'admin',
      }
      useAuthStore.getState().login(adminUser, 'token')

      expect(useAuthStore.getState().isAdmin()).toBe(true)
    })

    it('isAdmin() should return false for user role', () => {
      const user: User = {
        id: '1',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
      }
      useAuthStore.getState().login(user, 'token')

      expect(useAuthStore.getState().isAdmin()).toBe(false)
    })

    it('isUser() should return true for user role', () => {
      const user: User = {
        id: '1',
        email: 'user@example.com',
        name: 'User',
        role: 'user',
      }
      useAuthStore.getState().login(user, 'token')

      expect(useAuthStore.getState().isUser()).toBe(true)
    })

    it('isUser() should return true when no role specified', () => {
      const user: User = {
        id: '1',
        email: 'user@example.com',
        name: 'User',
      }
      useAuthStore.getState().login(user, 'token')

      expect(useAuthStore.getState().isUser()).toBe(true)
    })
  })
})