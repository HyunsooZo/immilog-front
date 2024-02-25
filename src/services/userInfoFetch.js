// useUserInfoUpdate.js
import { useUserInfoStore } from '@/stores/userInfo';

export const getUserInfo = async (sendRequest, latitude, longitude) => {
	if (localStorage.getItem('accessToken') === null) {
		return;
	}

	try {
		const { status, data } = await sendRequest(
			'get',
			`/auth/user?latitude=${latitude}&longitude=${longitude}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			},
			null,
		);

		if (status === 200) {
			const userInfoStore = useUserInfoStore();
			userInfoStore.setUserInfo(
				data.data.userSeq,
				data.data.accessToken,
				data.data.refreshToken,
				data.data.nickname,
				data.data.email,
				data.data.country,
				data.data.userProfileUrl,
				data.data.isLocationMatch,
			);
		}
	} catch (error) {
		console.error(error);
	}
};
