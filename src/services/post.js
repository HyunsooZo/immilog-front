import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

export const likeApi = async (path, seq, token) => {
	if (!token) {
		return { status: 'unauthenticated' };
	}

	try {
		const config = {
			method: 'patch',
			url: `/${path}/${seq}/like`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		};

		const response = await axios(config);
		return { status: response.status };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};
