import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore({
	id: 'userInfo',
	state: () => ({
		token: null,
		userNickname: null,
		userEmail: null,
		userCountry: null,
		userProfile: null,
		isLocationMatch: false,
	}),
	actions: {
		setUserInfo(token, nickname, email, country, userProfile, isLocationMatch) {
			this.token = token;
			this.userNickname = nickname;
			this.userEmail = email;
			this.userCountry = country;
			this.userProfile = userProfile;
			this.isLocationMatch = isLocationMatch;
		},
	},
});
