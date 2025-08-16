import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ICountry } from '@/shared/types/country';
import {
	getActiveCountries,
	convertCountriesToSelectItems,
} from '@/features/country/services/countryService';
import type { ISelectItem } from '@/shared/types/common';

export const useCountryStore = defineStore('country', () => {
	const countries = ref<ICountry[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// SelectDialog에서 사용할 수 있는 형태로 변환된 국가 목록
	const countrySelectItems = ref<ISelectItem[]>([]);

	// 활성 국가 목록 가져오기
	const fetchActiveCountries = async () => {
		loading.value = true;
		error.value = null;

		try {
			const data = await getActiveCountries();
			countries.value = data;
			countrySelectItems.value = convertCountriesToSelectItems(data);
		} catch (err) {
			error.value = '국가 목록을 불러오는데 실패했습니다.';
			console.error('Failed to fetch countries:', err);
		} finally {
			loading.value = false;
		}
	};

	// 국가 ID로 국가 정보 찾기
	const findCountryById = (id: string): ICountry | undefined => {
		return countries.value.find(country => country.id === id);
	};

	// 국가 코드로 국가 정보 찾기
	const findCountryByCode = (code: string): ICountry | undefined => {
		return countries.value.find(country => country.code === code);
	};

	// 국가 ID로 국가명(한국어) 가져오기
	const getCountryNameKo = (id: string): string => {
		const country = findCountryById(id);
		return country?.nameKo || '';
	};

	// 국가 ID로 국가명(영어) 가져오기
	const getCountryNameEn = (id: string): string => {
		const country = findCountryById(id);
		return country?.nameEn || '';
	};

	// 현재 언어에 맞는 국가명 가져오기 (ID 기반)
	const getCountryNameByLocale = (
		id: string,
		locale: string = 'ko',
	): string => {
		const country = findCountryById(id);
		if (!country) return '';

		return locale === 'ko' ? country.nameKo : country.nameEn;
	};

	// 현재 언어에 맞는 국가명 가져오기 (코드 기반)
	const getCountryNameByCodeAndLocale = (
		code: string,
		locale: string = 'ko',
	): string => {
		const country = findCountryByCode(code);
		if (!country) return '';

		return locale === 'ko' ? country.nameKo : country.nameEn;
	};

	// enum 값을 새로운 country ID로 매핑 (기존 호환성)
	const mapLegacyCountryToId = (legacyCountry: string): string => {
		// 기존 enum 값들을 새로운 API ID로 매핑
		const mapping: Record<string, string> = {
			SOUTH_KOREA: 'korea', // 실제 API에서 오는 ID로 수정 필요
			UNITED_STATES: 'usa',
			JAPAN: 'japan',
			CHINA: 'china',
			// 필요에 따라 추가
		};
		return mapping[legacyCountry] || legacyCountry;
	};

	return {
		countries,
		countrySelectItems,
		loading,
		error,
		fetchActiveCountries,
		findCountryById,
		findCountryByCode,
		getCountryNameKo,
		getCountryNameEn,
		getCountryNameByLocale,
		getCountryNameByCodeAndLocale,
		mapLegacyCountryToId,
	};
});
