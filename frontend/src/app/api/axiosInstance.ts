import axios from 'axios'
import { useAuthStore } from '@modules/auth/stores/useAuthStore'
import { ENV } from '@app/config/env'

export const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
})

// Request interceptor - add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
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
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }

    return Promise.reject(error)
  }
)