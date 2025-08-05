import type { IUser } from 'src/features/user/types';
import type { IApiResponse, IPagination } from '@/shared/types/common';

// 게시글 인터페이스
export interface IPost {
	postId: string;
	userId: string;
	userNickname: string;
	userProfileUrl: string;
	title: string;
	content: string;
	viewCount: number;
	likeCount: number;
	commentCount: number;
	tags: string[];
	attachments: string[];
	likeUsers: string[];
	bookmarkUsers: string[];
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
	commentId: string;
	userId: string;
	nickname: string;
	userProfileUrl: string;
	country: string;
	region: string;
	content: string;
	replies: IComment[];
	replyCount: number;
	upVotes: number;
	downVotes: number;
	likeUsers: string[];
	status: string;
	createdAt: string;
}

// 검색 결과 인터페이스
export interface ISearchResult {
	postId: string;
	title: string;
	content: string;
	userId: string;
	userProfileUrl: string;
	userNickname: string;
	commentCounts: number;
	viewCount: number;
	likeCount: number;
	tags: string[];
	attachments: string[];
	likeUsers: string[];
	bookmarkUsers: string[];
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

// 선택 메뉴 인터페이스
export interface ISelectMenu {
	active: boolean;
	label: string;
	value?: string;
}

// 채용 공고 인터페이스
export interface IJobPost {
	postId: string;
	userId: string;
	userNickname: string;
	userProfileUrl: string;
	title: string;
	content: string;
	viewCount: number;
	likeCount: number;
	tags: string[];
	attachments: string[];
	likeUsers: string[];
	bookmarkUsers: string[];
	country: string;
	region: string;
	companyName: string;
	companyLogo?: string;
	company?: string;
	industry: string;
	experience: string;
	salary: string;
	workType: string;
	deadline: string;
	status: string;
	createdAt: Date;
}

// 회사 정보 인터페이스
export interface ICompany {
	companyId: string;
	name: string;
	company?: string;
	companyIndustryCode?: string;
	companyPhone?: string;
	companyEmail?: string;
	companyHomepage?: string;
	companyAddress?: string;
	companyCountry?: string;
	companyCountryCode?: string;
	companyRegion?: string;
	companyLogo?: string;
	industry: string;
	description: string;
	location: string;
	website: string;
	logoUrl: string;
	employeeCount: number;
	established: string;
}

// API 응답 타입들
export interface IApiJobPost extends IApiResponse {
	data: IPagination<IJobPost>;
}

export interface IApiCompanyInfo extends IApiResponse {
	data: ICompany;
}

// API 이미지 인터페이스
export interface IApiImage extends IApiResponse {
	data: string[];
}
