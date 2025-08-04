import axios from 'axios';

// // API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem('accessToken');

export const getJobBoardsApi = async (
	country: string,
	sortingMethod: string,
	industry: string,
	experience: string,
	page: number,
) => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig(
			'get',
			`/api/jobboards?country=${country}&page=${page}`,
			null,
		);
		const response = await axios(config);
		return { status: response.status, data: response.data };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};

const createConfig = (method: string, url: string, data: unknown) => {
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
