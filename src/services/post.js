import useAxios from '@/composables/useAxios.js';

const { sendRequest } = useAxios();

export const likeApi = async (path, seq, token) => {
	if (!token) {
		return { status: 'unauthenticated' };
	}

	try {
		const { status } = await sendRequest('patch', `/${path}/${seq}/like`, {
			headers: {
				contentType: 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		return { status: status };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};
