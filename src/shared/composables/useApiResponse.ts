import type { AxiosResponse } from 'axios';

/**
 * API 응답 처리 관련 공통 유틸리티 함수들
 */
export function useApiResponse() {
	/**
	 * API 응답이 성공적이고 데이터가 있는지 확인
	 */
	const isSuccessResponse = (response: AxiosResponse, expectedStatus = 200): boolean => {
		return response.status === expectedStatus && response.data?.data;
	};

	/**
	 * 안전하게 배열 데이터 순회 처리
	 */
	const safeForEach = <T>(
		data: T[] | undefined,
		callback: (item: T, index: number) => void
	): void => {
		if (Array.isArray(data)) {
			data.forEach(callback);
		}
	};

	/**
	 * 안전하게 배열에 아이템 추가
	 */
	const safePush = <T>(targetArray: T[] | undefined, items: T[]): void => {
		if (targetArray && Array.isArray(items)) {
			items.forEach(item => targetArray.push(item));
		}
	};

	/**
	 * undefined를 기본값으로 변환
	 */
	const withDefault = <T>(value: T | undefined, defaultValue: T): T => {
		return value ?? defaultValue;
	};

	return {
		isSuccessResponse,
		safeForEach,
		safePush,
		withDefault,
	};
}