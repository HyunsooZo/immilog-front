import type { IApiResponse, IPagination } from '@/shared/types/common';

// 채용 공고 인터페이스
export interface IJobPost {
	postId: string;
	userId: string;
	userNickName: string;
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
