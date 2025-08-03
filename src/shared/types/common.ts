// 공통 타입 정의

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