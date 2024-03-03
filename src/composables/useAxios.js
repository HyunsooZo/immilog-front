import { useUserInfoStore } from '@/stores/userInfo';
import axios from 'axios';

const useAxios = router => {
	axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

	let callCount = 0;
	const sendRequest = async (method, url, headers = {}, data = {}) => {
		if (callCount > 0) {
			return;
		}
		try {
			const config = {
				method,
				url,
				...headers,
				...(method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'
					? { params: data }
					: { data }),
			};

			const response = await axios(config);
			if (
				response.status === 200 ||
				response.status === 201 ||
				response.status === 204
			) {
				if (url.includes('/auth/user?')) {
					const userInfoStore = useUserInfoStore();
					userInfoStore.setUserInfo(
						response.data.data.userSeq,
						response.data.data.accessToken,
						response.data.data.refreshToken,
						response.data.data.userNickname,
						response.data.data.userEmail,
						response.data.data.userCountry,
						response.data.data.userRegion,
						response.data.data.userProfile,
						response.data.data.isLocationMatch,
					);
				}
				callCount = 0;
				return { status: response.status, data: response.data };
			}
		} catch (error) {
			if (
				error.response &&
				(error.response.status === 401 ||
					error.response.status === 403 ||
					error.response.status === 404)
			) {
				const { status } = await refreshAccessToken(
					method,
					url,
					data,
					headers['Content-Type'],
				);
				if (status === 200) {
					return sendRequest(method, url, headers, data);
				}
			}
			return {
				status: error.response?.status || 500,
				error: error.response?.data || 'Internal Server Error',
			};
		}
	};

	const refreshAccessToken = async () => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			router.push('/sign-in');
			return;
		}
		try {
			callCount++;
			const refreshResponse = await axios.get(
				'/auth/refresh?token=' + refreshToken,
			);
			if (refreshResponse.status === 200) {
				localStorage.setItem(
					'accessToken',
					refreshResponse.data.data.accessToken,
				);
				localStorage.setItem(
					'refreshToken',
					refreshResponse.data.data.refreshToken,
				);
				callCount--;
			}
		} catch (error) {
			router.push('/sign-in');
		}
	};

	return {
		sendRequest,
	};
};

export default useAxios;
