// useUserInfoUpdate.js
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

export const getUserInfo = async (latitude, longitude) => {
	if (localStorage.getItem('accessToken') === null) {
		return;
	}
	try {
		// axios에 전달할 설정 객체
		const config = {
			method: 'get', // HTTP 메서드 설정
			url: `/auth/user?latitude=${latitude}&longitude=${longitude}`, // 요청 URL 설정
			headers: {
				contentType: 'application/json', // 콘텐트 타입 설정
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 인증 토큰 설정
			},
		};
		const { status, data } = await axios(config); // axios 요청 실행
		return { status, data }; // 응답 반환
	} catch (error) {
		console.error(error);
	}
};
