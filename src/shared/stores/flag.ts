import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { countryCodeToFlagCode } from '@/shared/utils/flagMapping';

export interface FlagInfo {
	countryCode: string;
	flagCode: string;
	flagClass: string;
	isCustomIcon: boolean;
}

export const useFlagStore = defineStore('flag', () => {
	// 국기 정보 캐시
	const flagCache = ref<Map<string, FlagInfo>>(new Map());
	
	// 앱 초기화 시 자주 사용되는 국가들의 국기 정보 미리 로드
	const preloadCommonFlags = () => {
		const commonCountries = [
			'KR', 'JP', 'CN', 'US', 'AU', 'GB', 'CA', 'DE', 'FR', 'IT', 'ES',
			'MY', 'SG', 'TH', 'VN', 'PH', 'ID', 'IN', 'NZ', 'BR', 'MX',
			'ALL', 'ETC'
		];
		
		commonCountries.forEach(countryCode => {
			getFlagInfo(countryCode);
		});
	};
	
	// 국기 정보 가져오기 (캐시 우선)
	const getFlagInfo = (countryCode: string): FlagInfo => {
		// 캐시에서 먼저 확인
		if (flagCache.value.has(countryCode)) {
			return flagCache.value.get(countryCode)!;
		}
		
		// 새로운 국기 정보 생성
		const flagCode = countryCodeToFlagCode(countryCode);
		const isCustomIcon = flagCode === 'etc' || flagCode === 'world' || !flagCode;
		
		const flagInfo: FlagInfo = {
			countryCode,
			flagCode,
			flagClass: flagCode ? `fi fi-${flagCode}` : '',
			isCustomIcon
		};
		
		// 캐시에 저장
		flagCache.value.set(countryCode, flagInfo);
		
		return flagInfo;
	};
	
	// 국기 클래스 직접 가져오기 (기존 호환성)
	const getFlagClass = (countryCode: string): string => {
		const flagInfo = getFlagInfo(countryCode);
		return flagInfo.flagClass;
	};
	
	// 국기 코드 직접 가져오기 (기존 호환성) 
	const getFlagCode = (countryCode: string): string => {
		const flagInfo = getFlagInfo(countryCode);
		return flagInfo.flagCode;
	};
	
	// 커스텀 아이콘 여부 확인
	const isCustomIcon = (countryCode: string): boolean => {
		const flagInfo = getFlagInfo(countryCode);
		return flagInfo.isCustomIcon;
	};
	
	// 커스텀 아이콘 이모지 가져오기
	const getCustomIconEmoji = (countryCode: string): string => {
		const flagCode = getFlagCode(countryCode);
		if (flagCode === 'etc') return '🏳️';
		if (flagCode === 'world') return '🌍';
		return '';
	};
	
	// 캐시된 국가 수
	const cachedCountriesCount = computed(() => flagCache.value.size);
	
	// 캐시 클리어
	const clearCache = () => {
		flagCache.value.clear();
	};
	
	return {
		// State
		flagCache,
		
		// Getters
		cachedCountriesCount,
		
		// Actions
		preloadCommonFlags,
		getFlagInfo,
		getFlagClass,
		getFlagCode,
		isCustomIcon,
		getCustomIconEmoji,
		clearCache
	};
});