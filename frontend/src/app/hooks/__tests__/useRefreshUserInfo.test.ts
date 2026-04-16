import { renderHook, waitFor } from '@testing-library/react'
import { useRefreshUserInfo } from '../useRefreshUserInfo'
import { useAuthStore } from '@app/stores/useAuthStore'
import { useGet } from '../useGet'

// Mock useGet hook
jest.mock('../useGet')

// Mock useAuthStore
jest.mock('@app/stores/useAuthStore')

interface MockUser {
  id: number
  name: string
  email: string
}

describe('useRefreshUserInfo Hook', () => {
  const mockUseGet = useGet as jest.MockedFunction<typeof useGet>
  const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch user data on mount', async () => {
    const mockUser: MockUser = { id: 1, name: 'John', email: 'john@example.com' }
    const mockRefetch = jest.fn()

    mockUseGet.mockReturnValue({
      data: mockUser,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: jest.fn(),
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    const { result } = renderHook(() => useRefreshUserInfo())

    expect(result.current.isLoading).toBe(false)
  })

  it('should call useGet with correct endpoint and cacheDuration', async () => {
    const mockUser: MockUser = { id: 1, name: 'John', email: 'john@example.com' }
    const mockRefetch = jest.fn()

    mockUseGet.mockReturnValue({
      data: mockUser,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: jest.fn(),
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    renderHook(() => useRefreshUserInfo())

    expect(mockUseGet).toHaveBeenCalledWith(
      '/auth/me',
      {
        autoFetch: true,
        cacheDuration: 0,
      }
    )
  })

  it('should update auth store when user data is fetched', async () => {
    const mockUser: MockUser = { id: 1, name: 'John', email: 'john@example.com' }
    const mockRefetch = jest.fn()
    const mockSetUser = jest.fn()

    mockUseGet.mockReturnValue({
      data: mockUser,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: mockSetUser,
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    renderHook(() => useRefreshUserInfo())

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser)
    })
  })

  it('should not update store when data is null', async () => {
    const mockRefetch = jest.fn()
    const mockSetUser = jest.fn()

    mockUseGet.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: mockSetUser,
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    renderHook(() => useRefreshUserInfo())

    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('should return isLoading state from useGet', async () => {
    const mockRefetch = jest.fn()

    mockUseGet.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: jest.fn(),
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    const { result } = renderHook(() => useRefreshUserInfo())

    expect(result.current.isLoading).toBe(true)
  })

  it('should provide refetch function from useGet', async () => {
    const mockRefetch = jest.fn()

    mockUseGet.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: jest.fn(),
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    const { result } = renderHook(() => useRefreshUserInfo())

    expect(result.current.refetch).toBe(mockRefetch)
  })

  it('should handle multiple user data updates', async () => {
    const mockUser1: MockUser = { id: 1, name: 'John', email: 'john@example.com' }
    const mockUser2: MockUser = { id: 1, name: 'Jane', email: 'jane@example.com' }
    const mockRefetch = jest.fn()
    const mockSetUser = jest.fn()

    mockUseGet.mockReturnValue({
      data: mockUser1,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    mockUseAuthStore.mockReturnValue({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: mockSetUser,
      setToken: jest.fn(),
      logout: jest.fn(),
      login: jest.fn(),
      clearAuth: jest.fn(),
      isAdmin: jest.fn().mockReturnValue(false),
      isUser: jest.fn().mockReturnValue(false),
    })

    const { rerender } = renderHook(() => useRefreshUserInfo())

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser1)
    })

    // Simulate user data change
    mockUseGet.mockReturnValue({
      data: mockUser2,
      error: null,
      isLoading: false,
      refetch: mockRefetch,
    })

    rerender()

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUser2)
    })
  })
})