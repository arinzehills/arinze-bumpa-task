import { useState, useEffect } from 'react'
import { axiosInstance } from '@app/api/axiosInstance'
import { AxiosRequestConfig } from 'axios'
import { ApiResponse } from '@app/api/types/apiResponse'

interface UseGetOptions {
  autoFetch?: boolean
  cacheDuration?: number
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache: Record<string, CacheEntry<unknown>> = {}

export function useGet<T = unknown>(
  endpoint: string,
  { autoFetch = true, cacheDuration = 5 * 60 * 1000 }: UseGetOptions = {},
  customOptions: AxiosRequestConfig = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isCacheValid = (cacheKey: string): boolean => {
    if (!cache[cacheKey]) return false
    const { timestamp } = cache[cacheKey]
    return Date.now() - timestamp < cacheDuration
  }

  const fetch = async () => {
    try {
      // Check cache first
      if (isCacheValid(endpoint)) {
        setData((cache[endpoint] as CacheEntry<T>).data)
        return
      }

      setIsLoading(true)
      setError(null)

      const response = await axiosInstance.get<ApiResponse<T>>(endpoint, customOptions)
      const responseData = response.data.data

      // Update cache
      cache[endpoint] = {
        data: responseData,
        timestamp: Date.now(),
      }

      setData(responseData)
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        'An error occurred'

      setError(errorMessage)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetch()
    }
  }, [endpoint])

  return { data, error, isLoading, refetch: fetch }
}