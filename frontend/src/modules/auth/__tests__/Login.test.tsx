import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Login } from '../Login'
import { useAuthStore } from '@app/stores/useAuthStore'
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

describe('Login Form', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({
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
      renderWithRouter(<Login />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })

      // Submit without filling email
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('should show email validation error for invalid email format', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Login />)

      const emailInput = screen.getByPlaceholderText('your@email.com')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should show password validation error when password is empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Login />)

      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.click(passwordInput)
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    it('should show password validation error when password is too short', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Login />)

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

      renderWithRouter(<Login />)

      const emailInput = screen.getByPlaceholderText('your@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
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

      renderWithRouter(<Login />)

      const emailInput = screen.getByPlaceholderText('your@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith(
          '/auth/login',
          {
            email: 'user@example.com',
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

      renderWithRouter(<Login />)

      const emailInput = screen.getByPlaceholderText('your@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /signing in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')

      // Button should show loading text
      expect(submitButton).toHaveTextContent('Signing in...')
    })
  })

  describe('Navigation', () => {
    it('should have link to registration page', () => {
      renderWithRouter(<Login />)

      const signUpLink = screen.getByRole('button', { name: /sign up here/i })
      expect(signUpLink).toBeInTheDocument()
    })

    it('should have link to admin login page', () => {
      renderWithRouter(<Login />)

      const adminLoginLink = screen.getByRole('button', { name: /admin login/i })
      expect(adminLoginLink).toBeInTheDocument()
    })
  })

  describe('Successful Login', () => {
    it('should store user data and redirect on successful login', async () => {
      const user = userEvent.setup()
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        user_type: 'user' as const,
        role: 'user' as const,
      }
      const mockToken = 'jwt-token-123'

      const mockExecute = jest.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
      })

      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        error: null,
        execute: mockExecute,
      })

      // Mock navigate
      const mockNavigate = jest.fn()
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }))

      renderWithRouter(<Login />)

      const emailInput = screen.getByPlaceholderText('your@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalled()
      })
    })
  })

  describe('UI Elements', () => {
    it('should render welcome heading', () => {
      renderWithRouter(<Login />)
      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    })

    it('should render subtitle text', () => {
      renderWithRouter(<Login />)
      expect(
        screen.getByText(/sign in to view your rewards and achievements/i)
      ).toBeInTheDocument()
    })

    it('should render email input with correct attributes', () => {
      renderWithRouter(<Login />)
      const emailInput = screen.getByPlaceholderText('your@email.com')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
    })

    it('should render password input with correct attributes', () => {
      renderWithRouter(<Login />)
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('name', 'password')
    })

    it('should render submit button', () => {
      renderWithRouter(<Login />)
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      expect(submitButton).toBeInTheDocument()
    })
  })
})