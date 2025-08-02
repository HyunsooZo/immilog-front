// UI 텍스트 상수
export const UI_TEXT = {
	CONFIRM_BUTTON: '확인',
	CANCEL_BUTTON: '취소',
} as const;

// 기본값 상수
export const DEFAULT_VALUES = {
	COMPANY_MANAGER_USER_SEQ: 21,
} as const;

// 로컬 스토리지 키 상수
export const STORAGE_KEYS = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken',
	USER_SEQ: 'userSeq',
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
	POSTS: '/posts',
	JOB_BOARDS: '/job-boards',
	USERS: '/users',
} as const;
