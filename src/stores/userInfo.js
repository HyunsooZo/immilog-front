import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore({
	id: 'userInfo',
	state: () => ({
		accessToken: null,
		refreshToken: null,
		userNickname: null,
		userEmail: null,
		userCountry: null,
		userProfile: null,
		isLocationMatch: false,
	}),
	actions: {
		setUserInfo(
			accessToken,
			refreshToken,
			nickname,
			email,
			country,
			userProfile,
			isLocationMatch,
		) {
			this.accessToken = accessToken;
			this.refreshToken = refreshToken;
			this.userNickname = nickname;
			this.userEmail = email;
			this.userCountry = country;
			this.userProfile = userProfile;
			this.isLocationMatch = isLocationMatch;
		},
	},
});
