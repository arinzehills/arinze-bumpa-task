import { useAdminAuthStore } from '../useAdminAuthStore'
import type { AdminUser } from '../useAdminAuthStore'

describe('useAdminAuthStore', () => {
  beforeEach(() => {
    useAdminAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useAdminAuthStore.getState()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login()', () => {
    it('should set admin user and token on login', () => {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
      const mockToken = 'admin-jwt-token'

      useAdminAuthStore.getState().login(mockAdmin, mockToken)

      const store = useAdminAuthStore.getState()
      expect(store.user).toEqual(mockAdmin)
      expect(store.token).toEqual(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should persist admin auth to localStorage', () => {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
      const mockToken = 'admin-jwt-token'

      useAdminAuthStore.getState().login(mockAdmin, mockToken)

      const stored = JSON.parse(localStorage.getItem('admin-auth-storage') || '{}')
      expect(stored.state.user).toEqual(mockAdmin)
      expect(stored.state.token).toEqual(mockToken)
    })
  })

  describe('logout()', () => {
    it('should clear admin user and token on logout', () => {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
      useAdminAuthStore.getState().login(mockAdmin, 'token')
      useAdminAuthStore.getState().logout()

      const store = useAdminAuthStore.getState()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('setToken()', () => {
    it('should update admin token', () => {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
      useAdminAuthStore.getState().login(mockAdmin, 'old-token')
      useAdminAuthStore.getState().setToken('new-token')

      const store = useAdminAuthStore.getState()
      expect(store.token).toBe('new-token')
      expect(store.user).toEqual(mockAdmin)
    })
  })

  describe('setUser()', () => {
    it('should update admin user', () => {
      const initialAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
      const updatedAdmin: AdminUser = {
        ...initialAdmin,
        name: 'Updated Admin',
      }

      useAdminAuthStore.getState().login(initialAdmin, 'token')
      useAdminAuthStore.getState().setUser(updatedAdmin)

      const store = useAdminAuthStore.getState()
      expect(store.user).toEqual(updatedAdmin)
      expect(store.token).toBe('token')
    })
  })

  describe('clearAuth()', () => {
    it('should clear all admin auth data', () => {
      const mockAdmin: AdminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      }
      useAdminAuthStore.getState().login(mockAdmin, 'token')
      useAdminAuthStore.getState().clearAuth()

      const store = useAdminAuthStore.getState()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })
})