import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AdminProtectedRoute } from '../AdminProtectedRoute'
import { useAdminAuthStore } from '@app/stores/useAdminAuthStore'

// Helper function to create test routes
const createTestRoutes = () => (
  <Routes>
    <Route path="/admin" element={<AdminProtectedRoute />}>
      <Route index element={<div>Admin Dashboard</div>} />
      <Route path="users" element={<div>Users Management</div>} />
    </Route>
    <Route path="/admin-login" element={<div>Admin Login</div>} />
    <Route path="/unauthorized" element={<div>Unauthorized</div>} />
  </Routes>
)

describe('AdminProtectedRoute', () => {
  beforeEach(() => {
    useAdminAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  describe('When not authenticated', () => {
    it('should redirect to /admin-login when not authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/admin']}>
          {createTestRoutes()}
        </MemoryRouter>
      )

      // Should show admin login page (redirect happened)
      expect(screen.getByText('Admin Login')).toBeInTheDocument()
      // Should not show admin dashboard
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    })
  })

  describe('When authenticated but not admin', () => {
    it('should redirect to /unauthorized for regular users', async () => {
      useAdminAuthStore.setState({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Regular User',
          role: 'user',
        },
        token: 'jwt-token',
        isAuthenticated: true,
      })

      render(
        <MemoryRouter initialEntries={['/admin']}>
          {createTestRoutes()}
        </MemoryRouter>
      )

      // Should show unauthorized page
      await waitFor(() => {
        expect(screen.getByText('Unauthorized')).toBeInTheDocument()
      })
      // Should not show admin dashboard
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    })
  })

  describe('When authenticated as admin', () => {
    it('should render admin content when user is admin', async () => {
      useAdminAuthStore.setState({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          user_type: 'admin',
        },
        token: 'jwt-token',
        isAuthenticated: true,
      })

      render(
        <MemoryRouter initialEntries={['/admin']}>
          {createTestRoutes()}
        </MemoryRouter>
      )

      // Should show admin dashboard
      await waitFor(() => {
        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
      })
      // Should not show login or unauthorized
      expect(screen.queryByText('Admin Login')).not.toBeInTheDocument()
      expect(screen.queryByText('Unauthorized')).not.toBeInTheDocument()
    })

    it('should render nested admin routes when authenticated as admin', async () => {
      useAdminAuthStore.setState({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
          user_type: 'admin',
        },
        token: 'jwt-token',
        isAuthenticated: true,
      })

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          {createTestRoutes()}
        </MemoryRouter>
      )

      // Should show nested route content
      await waitFor(() => {
        expect(screen.getByText('Users Management')).toBeInTheDocument()
      })
      expect(screen.queryByText('Admin Login')).not.toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle user with no role specified', async () => {
      useAdminAuthStore.setState({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'User Without Role',
          user_type: 'user',
        },
        token: 'jwt-token',
        isAuthenticated: true,
      })

      render(
        <MemoryRouter initialEntries={['/admin']}>
          {createTestRoutes()}
        </MemoryRouter>
      )

      // Should redirect to unauthorized (user without admin role)
      await waitFor(() => {
        expect(screen.getByText('Unauthorized')).toBeInTheDocument()
      })
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    })
  })
})