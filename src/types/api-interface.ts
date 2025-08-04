// 레거시 API 인터페이스 파일 - 호환성을 위해 유지
// 새로운 API 타입들은 features/{module}/types/ 또는 shared/types/ 에 정의하세요

// Re-exports for compatibility
export type { IPageable } from '@/features/job-board/types';
export type { IApiSearchResult } from '@/features/board/types';

export interface ILegacyApiInterface {
	// 필요시 레거시 API 인터페이스들을 여기에 추가
}