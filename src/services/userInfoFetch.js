import axios from 'axios';
import { refreshAccessToken } from '@/services/auth.js';

// API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

// 사용자 정보 요청 함수
export const getUserInfo = async (latitude, longitude) => {
	// 액세스 토큰 확인
	const accessToken = localStorage.getItem('accessToken');
	if (!accessToken) {
		// 액세스 토큰 미존재 시 에러 반환
		return { status: 401, error: 'No access token' };
	}

	try {
		// 요청 구성
		const config = {
			method: 'get',
			url: `/auth/user?latitude=${latitude}&longitude=${longitude}`,
			headers: {
				contentType: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		};

		// API 요청 및 응답 반환
		const response = await axios(config);
		return { status: response.status, data: response.data };
	} catch (error) {
		// 에러 처리
		console.error('Error:', error);
		if (error.response && [401, 403, 404].includes(error.response.status)) {
			// 토큰 갱신 시도
			const refreshResult = await refreshAccessToken();
			if (refreshResult && refreshResult.status === 200) {
				// 재시도
				return getUserInfo(latitude, longitude);
			}
		}
		// 기타 에러 반환
		return {
			status: error.response?.status || 500,
			error: 'Error fetching user info',
		};
	}
};
