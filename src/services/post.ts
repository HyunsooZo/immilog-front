import api from '@/api/index.ts'
import axios from 'axios'

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL
const token = localStorage.getItem('accessToken')

// 좋아요 API 요청 함수
export const likeApi = async (path: string, seq: number) => {
  // 토큰 미제공 시 인증되지 않음 반환
  if (!token) {
    return { status: 'unauthenticated' }
  }
  try {
    // API 요청 및 응답 상태 반환
    if (path === 'job-boards') {
      const response = await api.post(`/job-boards/${seq}/like/users/${localStorage.getItem('userSeq')}`)
      return { status: response.status }
    }
    const response = await api.post(`/posts/${seq}/like/users/${localStorage.getItem('userSeq')}`)
    return { status: response.status }
  } catch (error) {
    // 에러 발생 시 로그 기록 및 에러 상태 반환
    console.error(error)
    return { status: 'error', error }
  }
}

// view 업데이트 API 요청 함수
export const viewApi = async (seq: any, jobPostFlag: boolean) => {
  if (!token) {
    return { status: 'unauthenticated' }
  }
  try {
    const response = await api.patch(jobPostFlag ? `/job-boards/${seq}/view` : `/posts/${seq}/view`)
    return { status: response.status }
  } catch (error) {
    console.log(error)
    return { status: 'error', error }
  }
}

export const getBookmarkedPostApi = async () => {
  if (!token) {
    return { status: 'unauthenticated' }
  }
  try {
    const response = await api.get(`/bookmarks/post`)
    return { status: response.status, data: response.data }
  } catch (error) {
    console.log(error)
    return { status: 'error', error }
  }
}

export const postBookmark = async (seq: any) => {
  if (!token) {
    return { status: 'unauthenticated' }
  }
  try {
    const response = await api.post(`/bookmarks/post/${seq}`)
    return { status: response.status }
  } catch (error) {
    console.log(error)
    return { status: 'error', error }
  }
}

export const uploadPostApi = async (userSeq: number | null, param: any) => {
  if (!token) {
    return { status: 'unauthenticated' }
  }
  try {
    const response = await api.post(`/posts/users/${userSeq}`, param)
    return { status: response.status, data: response.data }
  } catch (error) {
    console.log(error)
    return { status: 'error', error }
  }
}

export const uploadJobBoardApi = async (param: any) => {
  if (!token) {
    return { status: 'unauthenticated' }
  }
  try {
    const response = await api.post(`/job-boards`, param)
    return { status: response.status, data: response.data }
  } catch (error) {
    console.log(error)
    return { status: 'error', error }
  }
}
