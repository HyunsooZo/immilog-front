import axios from 'axios'
import api from '@/api/index.ts'

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL

// 사용자 정보 요청 함수
export const getUserInfo = async (latitude: number, longitude: number): Promise<any> => {
  // 액세스 토큰 확인
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    // 액세스 토큰 미존재 시 에러 반환
    return { status: 400, error: 'No access token' }
  }

  try {
    // 요청 구성
    const config = {
      method: 'get',
      url: `/auth/user?latitude=${latitude}&longitude=${longitude}`,
      headers: {
        contentType: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }

    // API 요청 및 응답 반환
    const response = await api(config)
    return { status: response.status, data: response.data }
  } catch (error: unknown) {
    // 에러 처리
    console.error('Error:', error)
    localStorage.removeItem('accessToken')
    // 기타 에러 반환
    return {
      status: error,
      error: 'Error fetching user info'
    }
  }
}
