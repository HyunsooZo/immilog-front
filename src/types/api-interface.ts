import {
  IChat,
  IChatRoom,
  IJobPost,
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
  data: IPagenation<IChatRoom>
}

export interface IApiChatStart extends IApiResponse {
  data: IPagenation<IChatRoom>
}

export interface IApiChatRoomList extends IApiResponse {
  data: IChatRoom[]
}

export interface IApiChat extends IApiResponse {
  data: IPagenation<IChat>
}

export interface IApiSearchResult extends IApiResponse {
  data: IPagenation<ISearchResult>
}

export interface IApiJobPost extends IApiResponse {
  data: IPagenation<IJobPost>
}

// 게시글 리스트 인터페이스
export interface IApiPosts extends IApiResponse {
  data: IPagenation<IPost>
}

export interface IApiPostDetail extends IApiResponse {
  data: IPost
}

export interface IApiUserInfo extends IApiResponse {
  data: IUserInfo
}

export interface IApiImage extends IApiResponse {
  data: {
    imageUrl: string[]
  }
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

export interface IPagenation<T> {
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
