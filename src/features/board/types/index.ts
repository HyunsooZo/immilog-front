import type { IUser } from '@/features/auth/types';
import type { IApiResponse, IPagination } from '@/shared/types/common';

// 게시글 인터페이스
export interface IPost {
	seq: number;
	userSeq: number;
	userNickName: string;
	userProfileUrl: string;
	title: string;
	content: string;
	viewCount: number;
	likeCount: number;
	commentCount: number;
	tags: string[];
	attachments: string[];
	likeUsers: number[];
	bookmarkUsers: number[];
	comments: IComment[];
	isPublic: string;
	country: string;
	region: string;
	status: string;
	category: string;
	createdAt: string;
}

// 댓글 인터페이스
export interface IComment {
	seq: number;
	user: IUser;
	content: string;
	replies: IComment[];
	replyCount: number;
	upVotes: number;
	downVotes: number;
	likeUsers: number[];
	status: string;
	createdAt: string;
}

// 검색 결과 인터페이스
export interface ISearchResult {
	seq: number;
	title: string;
	content: string;
	userSeq: number;
	userProfileUrl: string;
	userNickName: string;
	commentCounts: number;
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
	keyword: string;
	createdAt: string;
}

// API 응답 타입들
export interface IApiPosts extends IApiResponse {
	data: IPagination<IPost>;
}

export interface IApiPostDetail extends IApiResponse {
	data: IPost;
}

export interface IApiSearchResult extends IApiResponse {
	data: IPagination<ISearchResult>;
}

export interface IApiImage extends IApiResponse {
	data: string[];
}