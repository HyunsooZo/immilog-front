import api from '@/core/api/index';
import axios from 'axios';

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

// 헬퍼 함수: 토큰과 userSeq 동적 획득
const getToken = () => localStorage.getItem('accessToken');
const getUserSeq = () => localStorage.getItem('userSeq');

// 공통 에러 핸들링 함수
const handleError = (error: unknown) => {
	console.error(error);
	return { status: 'error', error };
};

// 토큰 검증 함수 (토큰 없으면 null 반환)
const requireAuth = () => getToken();

// path에 따라 postType 결정 함수
const getPostType = (path: string): string => {
	switch (path) {
		case 'job-boards':
			return 'JOB_BOARD';
		case 'posts':
			return 'POST';
		default:
			return 'COMMENT';
	}
};

// 좋아요 API 요청 함수
export const likeApi = async (path: string, seq: number) => {
	const token = requireAuth();
	if (!token) return { status: 'unauthenticated' };

	try {
		const postType = getPostType(path);
		const response = await api.post(`/interaction/posts/${seq}`, null, {
			params: {
				interactionType: 'LIKE',
				postType,
				userSeq: getUserSeq(),
			},
		});
		return { status: response.status };
	} catch (error) {
		return handleError(error);
	}
};

// view 업데이트 API 요청 함수
export const viewApi = async (seq: number, jobPostFlag: boolean) => {
	try {
		const endpoint = jobPostFlag
			? `/job-boards/${seq}/view`
			: `/posts/${seq}/view`;
		const response = await api.patch(endpoint);
		return { status: response.status };
	} catch (error) {
		return handleError(error);
	}
};

// 북마크된 포스트 조회 API 요청 함수
export const getBookmarkedPostApi = async () => {
	const token = getToken();
	if (!token) return { status: 'unauthenticated' };

	try {
		const response = await api.get('/posts/bookmarks', {
			params: {
				userSeq: localStorage.getItem('userSeq'),
				postType: 'POST',
			},
		});
		return { status: response.status, data: response.data };
	} catch (error) {
		return handleError(error);
	}
};

// 포스트 북마크 API 요청 함수
export const postBookmark = async (seq: number, post: string) => {
	const token = requireAuth();
	if (!token) return { status: 'unauthenticated' };

	try {
		const userSeq = localStorage.getItem('userSeq');
		const response = await api.post(`/interaction/posts/${seq}`, null, {
			params: {
				userSeq: userSeq,
				interactionType: 'BOOKMARK',
				postType: 'POST',
			},
		});
		return { status: response.status };
	} catch (error) {
		return handleError(error);
	}
};

// 포스트 업로드 API 요청 함수
export const uploadPostApi = async (userSeq: number | null, param: any) => {
	const token = getToken();
	if (!token) return { status: 'unauthenticated' };

	try {
		const response = await api.post(`/posts/users/${userSeq}`, param);
		return { status: response.status, data: response.data };
	} catch (error) {
		return handleError(error);
	}
};

// 잡보드 업로드 API 요청 함수
export const uploadJobBoardApi = async (param: any) => {
	const token = getToken();
	if (!token) return { status: 'unauthenticated' };

	try {
		const response = await api.post(`/job-boards`, param);
		return { status: response.status, data: response.data };
	} catch (error) {
		return handleError(error);
	}
};
