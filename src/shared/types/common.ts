// 공통 타입 정의

// BoardType enum
export enum BoardType {
	POST = 'POST',
	JOBBOARD = 'JOBBOARD',
}

import type { IPost, IComment, ISearchResult } from '@/features/board/types';
import type { IUser, IUserInfo } from 'src/features/user/types';
import type { ILocation, IApiLocation } from '@/shared/types/location';
import type { IChatMessage, IChatRoom } from '@/features/chat/types';
import type { IJobPost, ICompany } from '@/features/board/types';

export type { IPost, IComment, ISearchResult } from '@/features/board/types';
export type { IUser, IUserInfo } from 'src/features/user/types';
export type { ILocation, IApiLocation } from '@/shared/types/location';
export type { IChatMessage, IChatRoom } from '@/features/chat/types';
export type { IJobPost, ICompany } from '@/features/board/types';
export type {
	ICountry,
	ICountryOption,
	CountryStatus,
} from '@/shared/types/country';

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
	userNickname?: string; // 백워드 호환성을 위해 유지
	email: string;
	country: string;
	region: string;
	userProfileUrl: string;
	profileImage?: string;
	nickName?: string; // 백워드 호환성을 위해 유지
	userSeq?: string;
	interestCountry?: string;
	isLocationMatch?: boolean;
}

// 상태 타입
export interface IState {
	isActive: boolean;
	label: string;
	value: string;
	posts?: IPost[];
	last?: boolean;
	loading?: boolean;
	pagination?: IPageable;
}

// 단순 상태 타입 (UserBoard용)
export interface ISimpleState {
	posts?: IPost[];
	last?: boolean;
	loading?: boolean;
	pagination?: IPageable;
}

// 에러 타입
export interface IError {
	code: string | number;
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

// 알림 관련 타입들
export interface INotification {
	id: string;
	title: string;
	content: string;
	type: string;
	isRead: boolean;
	createdAt: string;
}

export interface INotificationState {
	notifications?: INotification[];
	pagination?: IPageable;
	loading?: boolean;
}
