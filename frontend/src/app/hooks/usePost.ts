import { useState } from 'react'
import { axiosInstance } from '@app/api/axiosInstance'
import { SideToast } from '@components/Toast'
import { AxiosRequestConfig } from 'axios'

interface UsePostOptions {
  isMultipart?: boolean
  canToastError?: boolean
  canToastSuccess?: boolean
  invalidate?: string | string[]
}

export function usePost<T = unknown>() {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = async (
    endpoint: string,
    body: unknown,
    {
      isMultipart = false,
      canToastError = false,
      canToastSuccess = true,
    }: UsePostOptions = {},
    customOptions: AxiosRequestConfig = {}
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const config: AxiosRequestConfig = {
        ...customOptions,
        headers: {
          ...(isMultipart && { 'Content-Type': 'multipart/form-data' }),
          ...customOptions.headers,
        },
      }

      const response = await axiosInstance.post<T>(endpoint, body, config)
      const responseData = response.data

      setData(responseData)

      if (canToastSuccess) {
        SideToast.FireSuccess({
          title: 'Success',
          message: 'Operation completed successfully',
        })
      }

      return responseData
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        (err as Error)?.message ||
        'An error occurred'

      setError(errorMessage)

      if (canToastError) {
        SideToast.FireError({
          title: 'Error',
          message: errorMessage,
        })
      }

      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { data, error, isLoading, execute }
}