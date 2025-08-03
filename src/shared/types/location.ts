import type { IApiResponse } from '@/shared/types/common';

// 위치 관련 타입
export interface ILocation {
	country: string;
	region: string;
}

export interface IApiLocation extends IApiResponse {
	data: ILocation;
}

export interface IApiBoolean extends IApiResponse {
	data: boolean;
}