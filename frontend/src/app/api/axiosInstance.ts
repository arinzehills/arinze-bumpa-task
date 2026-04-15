import axios from 'axios'
import { ENV } from '@app/config/env'
import { useAppModeStore } from '@app/stores/useAppModeStore'
import { useAdminAuthStore } from '@app/stores/useAdminAuthStore'
import { useAuthStore } from '@app/stores/useAuthStore'

export const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
})

// Request interceptor - add token to requests based on app mode
axiosInstance.interceptors.request.use(
  (config) => {
    // Get app mode to determine which store to use
    const mode = useAppModeStore.getState().mode

    // Get token from appropriate store based on app mode
    const token =
      mode === 'admin'
        ? useAdminAuthStore.getState().token
        : useAuthStore.getState().token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - logout user from appropriate store
    if (error.response?.status === 401) {
      const mode = useAppModeStore.getState().mode
      if (mode === 'admin') {
        useAdminAuthStore.getState().logout()
      } else {
        useAuthStore.getState().logout()
      }
    }

    return Promise.reject(error)
  }
)