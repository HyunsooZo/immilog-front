import axios from 'axios';

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem('accessToken');

// 좋아요 API 요청 함수
export const likeApi = async (path, seq) => {
	// 토큰 미제공 시 인증되지 않음 반환
	if (!token) {
		return { status: 'unauthenticated' };
	}

	try {
		// 요청 구성
		const config = createConfig('patch', `/${path}/${seq}/like`, null);
		// API 요청 및 응답 상태 반환
		const response = await axios(config);
		return { status: response.status };
	} catch (error) {
		// 에러 발생 시 로그 기록 및 에러 상태 반환
		console.error(error);
		return { status: 'error', error };
	}
};

// view 업데이트 API 요청 함수
export const viewApi = async seq => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig('patch', `/posts/${seq}/view`, null);
		const response = await axios(config);
		return { status: response.status };
	} catch (error) {
		console.log(error);
		return { status: 'error', error };
	}
};

export const getBookmarkedPostApi = async () => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig('get', `/bookmarks`, null);
		const response = await axios(config);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.log(error);
		return { status: 'error', error };
	}
};

export const postBookmarkdApi = async seq => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig('post', `/bookmarks/posts/${seq}`, null);
		const response = await axios(config);
		return { status: response.status };
	} catch (error) {
		console.log(error);
		return { status: 'error', error };
	}
};

export const getMyPostsApi = async page => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig('get', `/posts/my?page=${page}`, null);
		const response = await axios(config);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.log(error);
		return { status: 'error', error };
	}
};

export const uploadPostApi = async param => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig('post', `/posts`, param);
		const response = await axios(config);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.log(error);
		return { status: 'error', error };
	}
};

const createConfig = (method, url, data) => {
	return {
		method,
		url,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		data,
	};
};
