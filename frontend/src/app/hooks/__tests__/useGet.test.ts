import { renderHook, waitFor, act } from '@testing-library/react'
import { useGet } from '../useGet'
import { axiosInstance } from '@app/api/axiosInstance'

// Mock axios
jest.mock('@app/api/axiosInstance')

interface TestData {
  id: number
  name: string
}

describe('useGet Hook', () => {
  const mockAxios = axiosInstance as jest.Mocked<typeof axiosInstance>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch data on mount when autoFetch is true', async () => {
    const mockData: TestData = { id: 1, name: 'Test' }
    mockAxios.get.mockResolvedValueOnce({
      data: {
        data: mockData,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() =>
      useGet<TestData>('/test-auto', { autoFetch: true })
    )

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.error).toBeNull()
    expect(mockAxios.get).toHaveBeenCalledWith('/test-auto', {})
  })

  it('should not fetch data on mount when autoFetch is false', async () => {
    const { result } = renderHook(() =>
      useGet('/test-no-auto', { autoFetch: false })
    )

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(mockAxios.get).not.toHaveBeenCalled()
  })

  it('should handle errors correctly', async () => {
    const errorMessage = 'Network error'
    mockAxios.get.mockRejectedValueOnce(
      new Error(errorMessage)
    )

    const { result } = renderHook(() =>
      useGet('/test-error', { autoFetch: true })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe(errorMessage)
    expect(result.current.data).toBeNull()
  })

  it('should allow manual refetch', async () => {
    const mockData: TestData = { id: 1, name: 'Test' }
    mockAxios.get.mockResolvedValue({
      data: {
        data: mockData,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() =>
      useGet<TestData>('/test-refetch', { autoFetch: true, cacheDuration: 0 })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })

    expect(mockAxios.get).toHaveBeenCalledTimes(1)

    // Call refetch wrapped in act
    await act(async () => {
      await result.current.refetch()
    })

    expect(mockAxios.get).toHaveBeenCalledTimes(2)
  })

  it('should use custom axios options', async () => {
    const mockData: TestData = { id: 1, name: 'Test' }
    const customHeaders = { 'X-Custom-Header': 'custom-value' }

    mockAxios.get.mockResolvedValueOnce({
      data: {
        data: mockData,
        message: 'Success',
        status: 200,
        success: true,
      },
    })

    const { result } = renderHook(() =>
      useGet<TestData>('/test-custom-opts', { autoFetch: true }, { headers: customHeaders })
    )

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData)
    })

    expect(mockAxios.get).toHaveBeenCalledWith('/test-custom-opts', {
      headers: customHeaders,
    })
  })
})