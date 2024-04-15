import { defineStore } from 'pinia'

interface UserInfoState {
  userSeq: number | null
  accessToken: string | null
  refreshToken: string | null
  userNickname: string | null
  userEmail: string | null
  userCountry: string | null
  userRegion: string | null
  userProfile: string | null
  isLocationMatch: boolean
}

export const useUserInfoStore = defineStore('userInfo', {
  state: (): UserInfoState => ({
    userSeq: null,
    accessToken: null,
    refreshToken: null,
    userNickname: null,
    userEmail: null,
    userCountry: null,
    userRegion: null,
    userProfile: null,
    isLocationMatch: false
  }),
  actions: {
    setUserInfo(
      userSeq: number | null,
      accessToken: string | null,
      refreshToken: string | null,
      nickname: string | null,
      email: string | null,
      country: string | null,
      region: string | null,
      userProfile: string | null,
      isLocationMatch: boolean
    ): void {
      this.userSeq = userSeq
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      this.userNickname = nickname
      this.userEmail = email
      this.userCountry = country
      this.userRegion = region
      this.userProfile = userProfile
      this.isLocationMatch = isLocationMatch
    },
    signOut(): void {
      this.userSeq = null
      this.accessToken = null
      this.refreshToken = null
      this.userNickname = null
      this.userEmail = null
      this.userCountry = null
      this.userRegion = null
      this.userProfile = null
      this.isLocationMatch = false
    }
  }
})
