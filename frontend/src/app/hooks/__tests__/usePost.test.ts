import { renderHook, act } from '@testing-library/react'
import { usePost } from '../usePost'
import { axiosInstance } from '@app/api/axiosInstance'
import { SideToast } from '@components/Toast'

// Mock axios
jest.mock('@app/api/axiosInstance')

// Mock SideToast
jest.mock('@components/Toast', () => ({
  SideToast: {
    FireSuccess: jest.fn(),
    FireError: jest.fn(),
  },
}))

interface TestResponse {
  id: number
  message: string
}

describe('usePost Hook', () => {
  const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>
  const mockSideToast = SideToast as jest.Mocked<typeof SideToast>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should execute POST request successfully', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    expect(result.current.isLoading).toBe(false)

    let response: TestResponse | null = null
    await act(async () => {
      response = await result.current.execute('/test-post', { name: 'Test' })
    })

    expect(response).toEqual(mockResponse)
    expect(result.current.data).toEqual(mockResponse)
    expect(result.current.error).toBeNull()
  })

  it('should show success toast by default', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Operation successful',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    await act(async () => {
      await result.current.execute('/test-post-toast', { name: 'Test' })
    })

    expect(mockSideToast.FireSuccess).toHaveBeenCalledWith({
      title: 'Success',
      message: 'Operation successful',
    })
  })

  it('should not show success toast when canToastSuccess is false', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    await act(async () => {
      await result.current.execute('/test-no-toast', { name: 'Test' }, { canToastSuccess: false })
    })

    expect(mockSideToast.FireSuccess).not.toHaveBeenCalled()
  })

  it('should handle errors correctly', async () => {
    const errorMessage = 'Validation failed'
    mockAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    let response: TestResponse | null = null
    await act(async () => {
      response = await result.current.execute('/test-error', { name: 'Test' })
    })

    expect(response).toBeNull()
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.data).toBeNull()
  })

  it('should show error toast when canToastError is true', async () => {
    const errorMessage = 'Server error'
    mockAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    await act(async () => {
      await result.current.execute('/test-error-toast', { name: 'Test' }, { canToastError: true })
    })

    expect(mockSideToast.FireError).toHaveBeenCalledWith({
      title: 'Error',
      message: errorMessage,
    })
  })

  it('should set multipart header when isMultipart is true', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    const formData = new FormData()
    formData.append('file', new Blob())

    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    await act(async () => {
      await result.current.execute('/test-upload', formData, { isMultipart: true, canToastSuccess: false })
    })

    const callConfig = mockAxios.post.mock.calls[0]?.[2] as any
    expect(callConfig?.headers?.['Content-Type']).toBe('multipart/form-data')
  })

  it('should use custom axios options', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    const customHeaders = { 'X-Custom-Header': 'custom-value' }

    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    await act(async () => {
      await result.current.execute(
        '/test-custom',
        { name: 'Test' },
        { canToastSuccess: false },
        { headers: customHeaders }
      )
    })

    const callConfig = mockAxios.post.mock.calls[0]?.[2] as any
    expect(callConfig?.headers?.['X-Custom-Header']).toBe('custom-value')
  })

  it('should handle error with fallback message', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => usePost<TestResponse>())

    let response: TestResponse | null = null
    await act(async () => {
      response = await result.current.execute('/test-fallback', { name: 'Test' })
    })

    expect(response).toBeNull()
    expect(result.current.error).toBe('Network error')
  })

  it('should complete request and set isLoading to false', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    expect(result.current.isLoading).toBe(false)

    await act(async () => {
      await result.current.execute('/test-loading', { name: 'Test' }, { canToastSuccess: false })
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toEqual(mockResponse)
  })

  it('should merge custom headers with multipart header', async () => {
    const mockResponse: TestResponse = { id: 1, message: 'Created' }
    const customHeaders = { 'X-Custom-Header': 'custom-value' }

    mockAxios.post.mockResolvedValueOnce({
      data: {
        data: mockResponse,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() => usePost<TestResponse>())

    await act(async () => {
      await result.current.execute(
        '/test-merged-headers',
        { file: 'data' },
        { isMultipart: true, canToastSuccess: false },
        { headers: customHeaders }
      )
    })

    const callConfig = mockAxios.post.mock.calls[0]?.[2] as any
    expect(callConfig?.headers?.['Content-Type']).toBe('multipart/form-data')
    expect(callConfig?.headers?.['X-Custom-Header']).toBe('custom-value')
  })
})