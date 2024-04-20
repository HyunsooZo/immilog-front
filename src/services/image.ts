import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import type { IApiImage } from '@/types/api-interface.ts'

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL
const token = localStorage.getItem('accessToken')

interface UploadResponse {
  status: number | 'unauthenticated' | 'error'
  error?: any
}

export const uploadImageApi = async (
  path: string,
  form: FormData
): Promise<AxiosResponse<IApiImage>> => {
  // 토큰 미제공 시 인증되지 않음 반환
  if (!token) {
    return { status: 'unauthenticated' } as AxiosResponse<IApiImage> & UploadResponse
  }
  try {
    // 요청 구성
    const config = createConfig('post', `/images?imagePath=${path}`, form)
    // API 요청 및 응답 상태 반환
    const response = await axios(config)
    return response
  } catch (error) {
    // 에러 발생 시 로그 기록 및 에러 상태 반환
    console.error(error)
    return { status: 'error', error } as AxiosResponse<IApiImage> & UploadResponse
  }
}

const createConfig = (method: Method, url: string, data: FormData): AxiosRequestConfig => {
  return {
    method,
    url,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    },
    data
  }
}
