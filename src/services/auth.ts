import { AxiosResponse } from 'axios'
import { IApiUserInfo } from '@/types/api-interface.ts'
import { applicationJsonWithToken } from '@/utils/header.ts'
import api from '@/api/index.ts'

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
      const response: AxiosResponse<IApiUserInfo> = await api.get(
        `/auth/user?latitude=${latitude}&longitude=${longitude}`,
        applicationJsonWithToken(accessToken)
      )
      if (response.status === 200 || response.data.status === 200) {
        isInProgress = false
        return response
      }
    } catch (error) {
      isInProgress = false
      throw error
    }
  }
}
