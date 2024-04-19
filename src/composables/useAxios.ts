import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { Router } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfo.ts'
import { IUserInfo } from '@/types/interface.ts' // UserInfo 타입 정의 필요

interface RequestParams {
  method: Method
  url: string
  headers?: Record<string, string>
  data?: any
}

interface ResponseData {
  status: number
  data?: any
  error?: string
}

const useAxios = (router: Router) => {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL
  let callCount = 0

  const sendRequest = async ({
    method,
    url,
    headers = {},
    data = {}
  }: RequestParams): Promise<ResponseData | undefined> => {
    if (callCount > 0) {
      return undefined
    }

    const config: AxiosRequestConfig = {
      method: method,
      url: url,
      headers: headers,
      ...(method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'
        ? { params: data }
        : { data })
    }

    try {
      const response: AxiosResponse = await axios(config)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        if (url.includes('/auth/user?')) {
          const userInfoStore = useUserInfoStore()
          const userData: IUserInfo = response.data.data // UserInfo 인터페이스 필요
          userInfoStore.setUserInfo(userData)
        }
        callCount = 0
        return { status: response.status, data: response.data }
      }
    } catch (error: any) {
      if (error.response && [401, 403, 404].includes(error.response.status)) {
        const refreshStatus = await refreshAccessToken({ method, url, data, headers })
        if (refreshStatus === 200) {
          return sendRequest({ method, url, headers, data })
        }
      }
      return {
        status: error.response?.status || 500,
        error: error.response?.data || 'Internal Server Error'
      }
    }
  }

  const refreshAccessToken = async ({
    method,
    url,
    data,
    headers
  }: RequestParams): Promise<number> => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      router.push('/sign-in')
      return 500 // 오류 코드 반환
    }

    try {
      callCount++
      const refreshResponse = await axios.get('/auth/refresh?token=' + refreshToken)
      if (refreshResponse.status === 200) {
        localStorage.setItem('accessToken', refreshResponse.data.data.accessToken)
        localStorage.setItem('refreshToken', refreshResponse.data.data.refreshToken)
        callCount--
        return 200
      }
    } catch {
      router.push('/sign-in')
    }
    return 500 // 오류 코드 반환
  }

  return {
    sendRequest
  }
}

export default useAxios
