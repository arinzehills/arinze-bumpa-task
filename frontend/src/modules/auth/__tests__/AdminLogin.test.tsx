import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AdminLogin } from '../AdminLogin'
import { useAdminAuthStore } from '@app/stores/useAdminAuthStore'
import { useAppModeStore } from '@app/stores/useAppModeStore'
import * as usePostModule from '@app/hooks/usePost'

// Mock environment and API layer
jest.mock('@app/api/axiosInstance')
jest.mock('@app/hooks/usePost')

// Helper to render with Router
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AdminLogin Form', () => {
  beforeEach(() => {
    // Reset stores
    useAdminAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    useAppModeStore.setState({ mode: 'user' })

    // Mock usePost
    const mockUsePost = jest.fn().mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
      execute: jest.fn(),
    })
    ;(usePostModule.usePost as jest.Mock).mockImplementation(mockUsePost)
  })

  describe('Form Validation', () => {
    it('should show email validation error when email is empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<AdminLogin />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('should show email validation error for invalid email format', async () => {
      const user = userEvent.setup()
      renderWithRouter(<AdminLogin />)

      const emailInput = screen.getByPlaceholderText('admin@email.com')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should show password validation error when password is empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<AdminLogin />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    it('should show password validation error when password is too short', async () => {
      const user = userEvent.setup()
      renderWithRouter(<AdminLogin />)

      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(passwordInput, '123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 6 characters')
        ).toBeInTheDocument()
      })
    })

    it('should not show validation errors when form is valid', async () => {
      const user = userEvent.setup()
      const mockExecute = jest.fn().mockResolvedValue(null)
      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<AdminLogin />)

      const emailInput = screen.getByPlaceholderText('admin@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'admin@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText(/is required/)).not.toBeInTheDocument()
        expect(screen.queryByText(/must be/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should call execute with correct payload on form submit', async () => {
      const user = userEvent.setup()
      const mockExecute = jest.fn().mockResolvedValue(null)
      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<AdminLogin />)

      const emailInput = screen.getByPlaceholderText('admin@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'admin@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith(
          '/auth/login',
          {
            email: 'admin@example.com',
            password: 'password123',
          },
          {
            canToastSuccess: true,
            canToastError: true,
          }
        )
      })
    })

    it('should show loading state while submitting', async () => {
      const user = userEvent.setup()
      const mockExecute = jest.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(null), 100)
          })
      )
      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: true,
        data: null,
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<AdminLogin />)

      const submitButton = screen.getByRole('button', { name: /signing in/i })
      expect(submitButton).toHaveTextContent('Signing in...')
    })
  })

  describe('Navigation', () => {
    it('should have link to user login page', () => {
      renderWithRouter(<AdminLogin />)

      const userLoginLink = screen.getByRole('button', { name: /user login/i })
      expect(userLoginLink).toBeInTheDocument()
    })
  })

  describe('Admin Validation', () => {
    it('should reject non-admin users with warning toast', async () => {
      const user = userEvent.setup()
      const nonAdminUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Regular User',
        user_type: 'user' as const,
        role: 'user' as const,
      }
      const mockExecute = jest.fn()

      // Mock usePost to return non-admin user response
      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: {
          user: nonAdminUser,
          token: 'jwt-token',
        },
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<AdminLogin />)

      const emailInput = screen.getByPlaceholderText('admin@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        // Non-admin user should not be logged in
        expect(useAdminAuthStore.getState().isAuthenticated).toBe(false)
      })
    })

    it('should successfully login admin users', async () => {
      const user = userEvent.setup()
      const adminUser = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        user_type: 'admin' as const,
        role: 'admin' as const,
      }
      const mockExecute = jest.fn()

      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: {
          user: adminUser,
          token: 'jwt-token-admin',
        },
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<AdminLogin />)

      const emailInput = screen.getByPlaceholderText('admin@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'admin@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        // App mode should be set to admin
        expect(useAppModeStore.getState().mode).toBe('admin')
      })
    })
  })

  describe('UI Elements', () => {
    it('should render admin portal heading', () => {
      renderWithRouter(<AdminLogin />)
      expect(screen.getByRole('heading', { name: /admin portal/i })).toBeInTheDocument()
    })

    it('should render subtitle text', () => {
      renderWithRouter(<AdminLogin />)
      expect(
        screen.getByText(/sign in to access the admin dashboard/i)
      ).toBeInTheDocument()
    })

    it('should render email input with correct attributes', () => {
      renderWithRouter(<AdminLogin />)
      const emailInput = screen.getByPlaceholderText('admin@email.com')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
    })

    it('should render password input with correct attributes', () => {
      renderWithRouter(<AdminLogin />)
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('name', 'password')
    })

    it('should render submit button', () => {
      renderWithRouter(<AdminLogin />)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toBeInTheDocument()
    })
  })
})