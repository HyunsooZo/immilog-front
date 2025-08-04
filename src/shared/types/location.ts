import type { IApiResponse } from '@/shared/types/common';

// 위치 관련 타입
export interface ILocation {
	country: string;
	region: string;
	latitude?: number;
	longitude?: number;
}

// 국가 정보 인터페이스
export interface ICountry {
	code: string;
	name: string;
	regions: string[];
}

export interface IApiLocation extends IApiResponse {
	data: ILocation;
}

export interface IApiBoolean extends IApiResponse {
	data: boolean;
}
