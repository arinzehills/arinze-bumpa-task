import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { Register } from '../Register'
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

describe('Register Form', () => {
  beforeEach(() => {
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
    it('should show name validation error when name is empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
      })
    })

    it('should show name validation error when name is too short', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const nameInput = screen.getByPlaceholderText('John Doe')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(nameInput, 'J')
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument()
      })
    })

    it('should show email validation error when email is empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      })
    })

    it('should show email validation error for invalid email format', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const emailInput = screen.getByPlaceholderText('you@email.com')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(emailInput, 'invalid-email')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should show password validation error when password is empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    it('should show password validation error when password is too short', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(passwordInput, '123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 6 characters')
        ).toBeInTheDocument()
      })
    })

    it('should show confirm password validation error when empty', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const submitButton = screen.getByRole('button', { name: /sign up/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Confirm password is required')
        ).toBeInTheDocument()
      })
    })

    it('should show password mismatch error when passwords do not match', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password456')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Passwords must match')).toBeInTheDocument()
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

      renderWithRouter(<Register />)

      const nameInput = screen.getByPlaceholderText('John Doe')
      const emailInput = screen.getByPlaceholderText('you@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText(/is required/)).not.toBeInTheDocument()
        expect(screen.queryByText(/must be/)).not.toBeInTheDocument()
        expect(screen.queryByText(/must match/)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should call execute with correct payload including password_confirmation', async () => {
      const user = userEvent.setup()
      const mockExecute = jest.fn().mockResolvedValue(null)
      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<Register />)

      const nameInput = screen.getByPlaceholderText('John Doe')
      const emailInput = screen.getByPlaceholderText('you@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalledWith(
          '/auth/register',
          {
            name: 'John Doe',
            email: 'user@example.com',
            password: 'password123',
            password_confirmation: 'password123',
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

      renderWithRouter(<Register />)

      const submitButton = screen.getByRole('button', { name: /creating account/i })
      expect(submitButton).toHaveTextContent('Creating account...')
    })
  })

  describe('Navigation', () => {
    it('should have link to login page', () => {
      renderWithRouter(<Register />)

      const loginLink = screen.getByRole('button', { name: /login here/i })
      expect(loginLink).toBeInTheDocument()
    })
  })

  describe('UI Elements', () => {
    it('should render create account heading', () => {
      renderWithRouter(<Register />)
      expect(
        screen.getByRole('heading', { name: /create account/i })
      ).toBeInTheDocument()
    })

    it('should render subtitle text', () => {
      renderWithRouter(<Register />)
      expect(
        screen.getByText(/join us and start earning rewards/i)
      ).toBeInTheDocument()
    })

    it('should render all required input fields', () => {
      renderWithRouter(<Register />)
      expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
      expect(screen.getAllByPlaceholderText('Enter your password')).toHaveLength(1)
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    })

    it('should render password input as type password', () => {
      renderWithRouter(<Register />)
      const passwordInputs = screen.getAllByPlaceholderText(/password/i)
      passwordInputs.forEach((input) => {
        expect(input).toHaveAttribute('type', 'password')
      })
    })

    it('should render submit button', () => {
      renderWithRouter(<Register />)
      const submitButton = screen.getByRole('button', { name: /sign up/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Password Matching', () => {
    it('should validate that passwords match on form submit', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Register />)

      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'differentpassword')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Passwords must match')).toBeInTheDocument()
      })
    })

    it('should allow form submission when passwords match', async () => {
      const user = userEvent.setup()
      const mockExecute = jest.fn().mockResolvedValue({
        user: { id: '1', email: 'user@example.com', name: 'John Doe' },
        message: 'Registration successful',
      })
      ;(usePostModule.usePost as jest.Mock).mockReturnValue({
        isLoading: false,
        data: null,
        error: null,
        execute: mockExecute,
      })

      renderWithRouter(<Register />)

      const nameInput = screen.getByPlaceholderText('John Doe')
      const emailInput = screen.getByPlaceholderText('you@email.com')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /sign up/i })

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'user@example.com')
      await user.type(passwordInput, 'password123')
      await user.type(confirmPasswordInput, 'password123')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockExecute).toHaveBeenCalled()
      })
    })
  })
})