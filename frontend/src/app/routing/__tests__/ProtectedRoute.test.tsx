import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'
import { useAuthStore } from '@app/stores/useAuthStore'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  })

  describe('When not authenticated', () => {
    it('should redirect to /login when not authenticated', () => {
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      )

      // Should show login page (redirect happened)
      expect(screen.getByText('Login Page')).toBeInTheDocument()
      // Should not show protected content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('When authenticated', () => {
    it('should render children when authenticated', () => {
      useAuthStore.setState({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'jwt-token',
        isAuthenticated: true,
      })

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      )

      // Should show protected content
      expect(screen.getByText('Protected Content')).toBeInTheDocument()
      // Should not show login
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    })

    it('should render children for admin users', () => {
      useAuthStore.setState({
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        },
        token: 'jwt-token',
        isAuthenticated: true,
      })

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
  })
})