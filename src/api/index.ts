import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true
})

// 요청 인터셉터 설정
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      try {
        const response = await api.post('/auth/refresh-token', {
          refreshToken: refreshToken
        })
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.accessToken)
          api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.accessToken
          return api(originalRequest)
        }
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default api
