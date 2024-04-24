import axios, { AxiosError } from 'axios'

interface RefreshResponse {
  status: number
  error?: string
}

// Token을 새로고침하는 함수입니다.
export const refreshAccessToken = async (): Promise<RefreshResponse> => {
  // Local Storage에서 refreshToken을 가져옴.
  const refreshToken = localStorage.getItem('refreshToken')

  // refreshToken이 없다면, 401 상태와 에러 메시지를 반환.
  if (!refreshToken) {
    return { status: 401, error: 'No refresh token' }
  }

  try {
    // axios를 사용하여 token 새로고침 API를 호출합니다.
    const refreshResponse = await axios.get(`/auth/refresh?token=${refreshToken}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    // 응답이 성공적이면 (HTTP 상태 코드 200),
    // 새로운 accessToken과 refreshToken을 Local Storage에 저장.
    if (refreshResponse.status === 200) {
      localStorage.setItem('accessToken', refreshResponse.data.data.accessToken)
      localStorage.setItem('refreshToken', refreshResponse.data.data.refreshToken)

      // 성공적으로 처리되었음을 나타내는 HTTP 상태 코드 200을 반환.
      return { status: 200 }
    }
  } catch (error) {
    // 에러가 발생하면 콘솔에 에러를 출력하고,
    // 에러 응답이 있는 경우 해당 상태 코드와 함께 에러 메시지를 반환하거나,
    // 그렇지 않은 경우 HTTP 상태 코드 500과 함께 에러 메시지를 반환.
    const axiosError = error as AxiosError
    console.error(axiosError)
    return {
      status: axiosError.response?.status || 500,
      error: 'Error refreshing token'
    }
  }

  localStorage.removeItem('accessToken')
  return { status: 500, error: 'Unknown error' }
}
