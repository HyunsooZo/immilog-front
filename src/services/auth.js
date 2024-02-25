import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const refreshAccessToken = async () => {
	const refreshToken = localStorage.getItem('refreshToken');
	if (!refreshToken) {
		return;
	}
	try {
		const refreshResponse = await axios.get(
			'/auth/refresh?token=' + refreshToken,
			null,
			{
				headers: { contentType: 'application/json' },
			},
		);
		if (refreshResponse.status === 200) {
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
		}
	} catch (error) {
		router.push('/sign-in');
		return;
	}
};

export default { refreshAccessToken };
