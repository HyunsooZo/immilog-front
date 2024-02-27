// 네이티브 개발 전 임시 스토어
import { defineStore } from 'pinia';

// 위치 정보를 위한 Pinia 스토어
export const useLocationStore = defineStore({
	id: 'location', // 스토어 식별자
	state: () => ({
		latitude: null, // 위도
		longitude: null, // 경도
	}),
	actions: {
		// 위치 설정 메서드
		setLocation({ latitude, longitude }) {
			this.latitude = latitude;
			this.longitude = longitude;
		},
	},
});

// 국가 정보를 위한 Pinia 스토어
export const useCountryStore = defineStore({
	id: 'country', // 스토어 식별자
	state: () => ({
		country: null, // 국가명
		region: null, // 지역명
	}),
	actions: {
		// 국가 설정 메서드
		setCountry({ country, region }) {
			this.country = country;
			this.region = region;
		},
	},
});
