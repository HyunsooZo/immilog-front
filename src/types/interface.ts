import type { IPageable } from '@/types/api-interface.ts'

export interface ISelectMenu {
  active: any
  label: string
}

export interface ISelectItem {
  name: string
  code: string
}

export interface IImage {
  imageUrl: string[]
}

// 정렬 정보 인터페이스
export interface ISortInfo {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

export interface IChatRoom {
  seq: number
  sender: IUser
  recipient: IUser
  lastChat: string
  unreadCountForSender: number
  unreadCountForRecipient: number
  lastChatTime: string
}

// 댓글 인터페이스
export interface IComment {
  seq: number
  user: IUser
  content: string
  replies: IComment[]
  upVotes: number
  downVotes: number
  likeUsers: number[]
  status: string
  createdAt: string
}

// 채팅 인터페이스
export interface IChat {
  id: number
  chatRoomSeq: number
  content: string
  sender: IUser
  recipient: IUser
  readStatus: boolean
  attachments: string[]
  createdAt: string
}

// 게시글 인터페이스
export interface IPost {
  seq: number
  title: string
  content: string
  userSeq: number
  userProfileUrl: string
  userNickName: string
  comments: IComment[]
  viewCount: number
  likeCount: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  isPublic: string
  country: string
  region: string
  category: string
  status: string
  createdAt: string
}

// 검색결과 인터페이스
export interface ISearchResult {
  seq: number
  title: string
  content: string
  userSeq: number
  likeCount: number
  viewCount: number
  isPublic: string
  userProfileUrl: string
  userNickName: string
  commentCounts: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  country: string
  region: string
  category: string
  status: string
  keyword: string
  createdAt: string
}

export interface IUser {
  seq: number
  nickName: string
  email: string
  profileImage: string
  reportedCount: number
  reportedDate: string
  country: string
  interestCountry: string
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

export interface INotificationState {
  notifications: INotification[]
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

export interface IUserInfo {
  userSeq: number | null
  accessToken: string | null
  refreshToken: string | null
  nickname: string | null
  email: string | null
  country: string | null
  interestCountry: string | null
  region: string | null
  userProfileUrl: string | null
  isLocationMatch: boolean
}

export interface IError {
  code: any
  message: any
}

export interface IOtherUserInfo {
  userSeq: number
  userProfileUrl: string | null
  userNickName: string
  country: string
  region: string
}

// 구인구직 인터페이스
export interface IJobPost {
  seq: number
  title: string
  content: string
  user: IUser
  viewCount: number
  likeCount: number
  tags: string[]
  attachments: string[]
  likeUsers: number[]
  bookmarkUsers: number[]
  country: string
  region: string
  industry: string
  deadline: string | Date
  experience: string
  salary: string
  company: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  companyHomepage: string
  companyLogo: string
  status: string
  createdAt: string | Date
}
export interface INoticiationPageable {
  pagination: IPageable
}
export interface INotification {
  seq: number
  authorUserSeq: number
  title: string
  content: string
  type: string
  status: string
  targetCountries: string[]
  readUsers: number[]
}
