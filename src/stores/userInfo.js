import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore({
	id: 'userInfo',
	state: () => ({
		userSeq: null,
		accessToken: null,
		refreshToken: null,
		userNickname: null,
		userEmail: null,
		userCountry: null,
		userRegion: null,
		userProfile: null,
		isLocationMatch: false,
	}),
	actions: {
		setUserInfo(
			userSeq,
			accessToken,
			refreshToken,
			nickname,
			email,
			country,
			region,
			userProfile,
			isLocationMatch,
		) {
			this.userSeq = userSeq;
			this.accessToken = accessToken;
			this.refreshToken = refreshToken;
			this.userNickname = nickname;
			this.userEmail = email;
			this.userCountry = country;
			this.userRegion = region;
			this.userProfile = userProfile;
			this.isLocationMatch = isLocationMatch;
		},
		signOut() {
			this.userSeq = null;
			this.accessToken = null;
			this.refreshToken = null;
			this.userNickname = null;
			this.userEmail = null;
			this.userCountry = null;
			this.userRegion = null;
			this.userProfile = null;
			this.isLocationMatch = false;
		},
	},
});
