import api from '@/core/api/index';
import type { ICountry, ICountryListResponse, ICountryResponse } from '@/shared/types/country';

// 활성 국가 목록 조회
export const getActiveCountries = async (): Promise<ICountry[]> => {
	try {
		const response = await api.get<ICountry[]>('/api/countries');
		return response.data;
	} catch (error) {
		console.error('Failed to fetch active countries:', error);
		throw error;
	}
};

// 모든 국가 목록 조회 (관리자용)
export const getAllCountries = async (): Promise<ICountry[]> => {
	try {
		const response = await api.get<ICountry[]>('/api/countries/all');
		return response.data;
	} catch (error) {
		console.error('Failed to fetch all countries:', error);
		throw error;
	}
};

// 특정 국가 조회
export const getCountryById = async (id: string): Promise<ICountry> => {
	try {
		const response = await api.get<ICountry>(`/api/countries/${id}`);
		return response.data;
	} catch (error) {
		console.error(`Failed to fetch country with id ${id}:`, error);
		throw error;
	}
};

// 국가 목록을 SelectDialog에서 사용할 수 있는 형태로 변환 (번역 키 사용)
export const convertCountriesToSelectItems = (countries: ICountry[]) => {
	return countries.map(country => ({
		name: `country.${country.id}`, // 번역 키 형태로 변환
		code: country.id,
		nameKo: country.nameKo,
		nameEn: country.nameEn,
		continent: country.continent,
	}));
};

// 국가 ID를 번역 키로 변환
export const getCountryTranslationKey = (countryId: string): string => {
	return `country.${countryId}`;
};