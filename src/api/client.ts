import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth')
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
