import axios from 'axios';
import { useRouter } from 'vue-router';

export default function useAxios() {
	const router = useRouter();
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
				callCount--;
				return { status: response.status, data: response.data };
			}
		} catch (error) {
			if (
				error.response &&
				(error.response.status === 401 ||
					error.response.status === 403 ||
					error.response.status === 404)
			) {
				await refreshAccessToken(method, url, data, headers.contentType);
			}

			return {
				status: error.response?.status || 500,
				error: error.response?.data || 'Internal Server Error',
			};
		}
	};

	const refreshAccessToken = async (method, url, data, type) => {
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) {
			return;
		}
		try {
			callCount++;
			const refreshResponse = await axios.get(
				'/auth/refresh?token=' + refreshToken,
				null,
				{
					headers: { contentType: 'application/json' },
				},
			);
			if (refreshResponse.status === 200) {
				callCount--;
				localStorage.setItem(
					'accessToken',
					refreshResponse.data.data.accessToken,
					console.log(refreshResponse.data.data.accessToken),
				);
				localStorage.setItem(
					'refreshToken',
					refreshResponse.data.data.refreshToken,
					console.log(refreshResponse.data.data.refreshToken),
				);
				const config = {
					method,
					url,
					headers: {
						contentType: type,
						Authorization: `Bearer ${refreshResponse.data.data.accessToken}`,
					},
					...(method.toLowerCase() === 'get' ||
					method.toLowerCase() === 'delete'
						? { params: data }
						: { data }),
				};

				await axios(config);
			}
		} catch (error) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			router.push('/sign-in');
			return;
		}
	};

	return {
		sendRequest,
	};
}
