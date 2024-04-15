import type { IPost, IPageable } from '@/types/api-interface.ts'

export interface ISelectItem {
  name: string
  code: string
}

export interface IUser {
  seq: number
  nickName: string
  email: string
  profileImage: string
  reportedCount: number
  reportedDate: string
  country: string
  region: string
  userRole: string
  userStatus: string
}

export interface IState {
  posts: IPost[]
  pagination: IPageable
  loading: boolean
  last: boolean
}

export interface ILocation {
  latitude: number | null
  longitude: number | null
}

export interface ICountry {
  country: string | null
  region: string | null
}
