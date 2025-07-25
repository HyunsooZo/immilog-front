import {
  IChat,
  IChatRoom,
  ICompany,
  IJobPost,
  INotification,
  IPost,
  ISearchResult,
  ISortInfo,
  IUserInfo
} from './interface.ts'

// 페이징 정보 인터페이스
export interface IPageable {
  sort: ISortInfo
  pageSize: number
  pageNumber: number
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface IApiChatRoom extends IApiResponse {
  data: IPagination<IChatRoom>
}

export interface IApiChatStart extends IApiResponse {
  data: IPagination<IChatRoom>
}

export interface IApiChatRoomList extends IApiResponse {
  data: IChatRoom[]
}

export interface IApiChat extends IApiResponse {
  data: IPagination<IChat>
}

export interface IApiSearchResult extends IApiResponse {
  data: IPagination<ISearchResult>
}

export interface IApiJobPost extends IApiResponse {
  data: IPagination<IJobPost>
}

// 게시글 리스트 인터페이스
export interface IApiPosts extends IApiResponse {
  data: IPagination<IPost>
}

export interface IApiPostDetail extends IApiResponse {
  data: IPost
}

export interface IApiUserInfo extends IApiResponse {
  data: IUserInfo
}

export interface IApiImage extends IApiResponse {
  data: string[];
}

export interface IApiNotifications extends IApiResponse {
  data: IPagination<INotification>
}

export interface IApiLocation extends IApiResponse {
  data: {
    country: string
    region: string
  }
}

export interface IApiBoolean extends IApiResponse {
  data: boolean
}

// 공통 API 응답 인터페이스
export interface IApiResponse {
  status: number
  message: string
}

export interface IPagination<T> {
  content: T[]
  pageable: IPageable
  last: boolean
  totalPages: number
  totalElements: number
  sort: ISortInfo
  first: boolean
  number: number
  numberOfElements: number
  size: number
  empty: boolean
}

export interface IApiRefreshToken extends IApiResponse {
  data: {
    refreshToken: string
    accessToken: string
  }
}

export interface IApiErrorResponse {
  errorCode: string
  message: string
}

export interface IApiUnreadNotification extends IApiResponse {
  data: boolean
}

export interface IApiCompanyInfo extends IApiResponse {
  data: ICompany
}
