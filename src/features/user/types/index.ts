import type { IApiResponse } from '@/shared/types/common.ts';

// 사용자 정보 인터페이스
export interface IUser {
	userId: string;
	nickname: string;
	email: string;
	country: string;
	region: string;
	userProfileUrl: string;
}

export interface IUserInfo {
	userId: string;
	accessToken: string;
	refreshToken: string;
	nickname: string;
	email: string;
	country: string;
	interestCountry: string;
	region: string;
	userProfileUrl: string;
	isLocationMatch: boolean;
	userSeq?: string;
}

// API 응답 타입들
export interface IApiUserInfo extends IApiResponse {
	data: IUserInfo;
}

export interface IApiRefreshToken extends IApiResponse {
	data: {
		refreshToken: string;
		accessToken: string;
	};
}

// 폼 필드 관련 타입
export interface IField {
	name: string;
	label: string;
	translationKey: string;
	model: {
		value: string;
	};
}

export interface IFormFields {
	isActive: Record<string, boolean>;
	labelFields: Record<string, boolean>;
	visibleFields: Record<string, boolean>;
	select: Record<string, boolean>;
	verification: Record<string, boolean>;
}

// API 게시글 목록 인터페이스
export interface IApiPosts extends IApiResponse {
	data: {
		content: any[];
		pageable: any;
		last: boolean;
		totalPages: number;
		totalElements: number;
	};
}

// API 알림 인터페이스
export interface IApiUnreadNotification extends IApiResponse {
	data: boolean;
}
