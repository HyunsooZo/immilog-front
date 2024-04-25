import axios, { AxiosError, AxiosResponse } from 'axios'
import { IApiUserInfo, IApiRefreshToken } from '@/types/api-interface.ts'
import { applicationJsonWithToken } from '@/utils/header.ts'

let isInProgress = false
export const fetchUserInfo = async (accessToken: string | null | undefined) => {
  if (!accessToken) {
    throw new Error('No access token found.')
  }
  if (!isInProgress) {
    isInProgress = true
    const latitude = localStorage.getItem('latitude') || '0'
    const longitude = localStorage.getItem('longitude') || '0'
    try {
      const response: AxiosResponse<IApiUserInfo> = await axios.get(
        `/auth/user?latitude=${latitude}&longitude=${longitude}`,
        applicationJsonWithToken(accessToken)
      )
      if (response.status === 200 || response.data.status === 200) {
        isInProgress = false
        return response
      } else {
        await refreshAccessToken()
      }
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        await refreshAccessToken()
      }
      isInProgress = false
      throw error
    }
  }
}

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token found.')
  }
  try {
    const response: AxiosResponse<IApiRefreshToken> = await axios.get(
      `/auth/refresh?token=${refreshToken}`
    )
    if (response.status === 200 && response.data.status === 200) {
      await setTokens(response)
      return fetchUserInfo(response.data.data.accessToken)
    } else {
      isInProgress = false
      removeTokens()
    }
  } catch (error) {
    isInProgress = false
    removeTokens()
    throw error
  }
}

const removeTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

const setTokens = async (response: AxiosResponse<IApiRefreshToken>) => {
  localStorage.setItem('accessToken', response.data.data.accessToken)
  localStorage.setItem('refreshToken', response.data.data.refreshToken)
  if (
    localStorage.getItem('accessToken') === response.data.data.accessToken &&
    localStorage.getItem('refreshToken') === response.data.data.refreshToken
  ) {
    isInProgress = false
  }
}
