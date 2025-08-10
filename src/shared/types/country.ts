// Country 관련 타입 정의

export enum CountryStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface ICountry {
	id: string;
	nameKo: string;
	nameEn: string;
	continent: string;
	status: CountryStatus;
	createdAt: string;
	updatedAt: string;
}

// API 응답 타입
export interface ICountryListResponse {
	data: ICountry[];
	status: number;
	message?: string;
}

export interface ICountryResponse {
	data: ICountry;
	status: number;
	message?: string;
}

// 기존 호환성을 위한 Country enum (기존 코드에서 사용중인 경우)
export enum Country {
	SOUTH_KOREA = 'SOUTH_KOREA',
	UNITED_STATES = 'UNITED_STATES',
	JAPAN = 'JAPAN',
	CHINA = 'CHINA',
	CANADA = 'CANADA',
	AUSTRALIA = 'AUSTRALIA',
	UNITED_KINGDOM = 'UNITED_KINGDOM',
	GERMANY = 'GERMANY',
	FRANCE = 'FRANCE',
	// 필요에 따라 추가
}

// 국가 선택을 위한 옵션 타입
export interface ICountryOption {
	value: string;
	labelKo: string;
	labelEn: string;
	continent: string;
}