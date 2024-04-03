import axios from 'axios';

// // API 기본 URL 설정
axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem('accessToken');

export const getJobBoardsApi = async (
	country,
	sortingMethod,
	industry,
	experience,
	page,
) => {
	if (!token) {
		return { status: 'unauthenticated' };
	}
	try {
		const config = createConfig(
			'get',
			`/job-boards?country=${country}&sortingMethod=${sortingMethod}&industry=${industry}&experience=${experience}&page=${page}`,
			null,
		);
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
