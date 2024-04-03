export interface IUser {
  seq: number;
  nickName: string;
  email: string;
  profileImage: string;
  reportedCount: number;
  reportedDate: string;
  country: string;
  region: string;
  userRole: string;
  userStatus: string;
}

export interface IPost {
  seq: number;
  title: string;
  content: string;
  userSeq: number;
  userProfileUrl: string;
  userNickName: string;
  comments: string[];
  viewCount: number;
  likeCount: number;
  tags: string[];
  attachments: string[];
  likeUsers: number[];
  bookmarkUsers: number[];
  isPublic: string;
  country: string;
  region: string;
  status: string;
  category: string;
  createdAt: string;
}
