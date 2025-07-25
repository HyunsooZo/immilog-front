import { IApiRefreshToken } from '@/types/api-interface.ts'
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  withCredentials: true
})

// 요청 인터셉터 설정
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


let isRefreshing = false
interface QueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: QueueItem[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // Refresh token이 없는 경우 처리 (로그아웃 등)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return Promise.reject(error)
      }

      try {
        const response: AxiosResponse<IApiRefreshToken> = await axios.get(
          `/auth/refresh?token=${refreshToken}`
        )
        if (response.status === 200) {
          const newAccessToken = response.data.data.accessToken
          const newRefreshToken = response.data.data.refreshToken
          localStorage.setItem('accessToken', newAccessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken
          processQueue(null, newAccessToken)
          return api(originalRequest)
        } else {
          processQueue(new Error('Failed to refresh token'), null)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          return Promise.reject(error)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
