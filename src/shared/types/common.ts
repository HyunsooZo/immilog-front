// 공통 타입 정의

// 다른 모듈에서 필요한 타입들을 re-export
export type { IPost, IComment, ISearchResult } from '@/features/board/types';
export type { IUser, IUserInfo } from '@/features/auth/types';
export type { ILocation, IApiLocation } from '@/shared/types/location';
export type { IChat, IChatRoom } from '@/features/chat/types';
export type { IJobPost, ICompany } from '@/features/job-board/types';

export interface ISelectItem {
	name: string;
	code: string;
}

export interface ISelectMenu {
	active: boolean;
	label: string;
}

export interface IImage {
	imageUrl: string[];
}

// 정렬 정보 인터페이스
export interface ISortInfo {
	sorted: boolean;
	unsorted: boolean;
	empty: boolean;
}

// 페이징 정보 인터페이스
export interface IPageable {
	sort: ISortInfo;
	pageSize: number;
	pageNumber: number;
	offset: number;
	paged: boolean;
	unpaged: boolean;
}

// 공통 API 응답 인터페이스
export interface IApiResponse {
	status: number;
	message: string;
}

export interface IPagination<T> {
	content: T[];
	pageable: IPageable;
	last: boolean;
	totalPages: number;
	totalElements: number;
	sort: ISortInfo;
	first: boolean;
	number: number;
	numberOfElements: number;
	size: number;
	empty: boolean;
}

export interface IApiErrorResponse {
	errorCode: string;
	message: string;
}

// 사용자 타입들
export interface IOtherUserInfo {
	userId: string;
	nickname: string;
	email: string;
	country: string;
	region: string;
	userProfileUrl: string;
	interestCountry?: string;
	isLocationMatch?: boolean;
}

// 상태 타입
export interface IState {
	isActive: boolean;
	label: string;
	value: string;
	posts?: any[];
	last?: boolean;
	loading?: boolean;
}

// 에러 타입
export interface IError {
	code: string;
	message: string;
}

// 폼 필드 타입들
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

// API 이미지 타입
export interface IApiImage {
	imageUrl: string[];
	data?: string[];
}
