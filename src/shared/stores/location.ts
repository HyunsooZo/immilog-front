import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ILocation, ICountry } from '@/shared/types/location';

// 위치 정보를 위한 Pinia 스토어 (Composition API 방식)
export const useLocationStore = defineStore('location', () => {
	const country = ref<string>('');
	const region = ref<string>(''); 
	const latitude = ref<number | undefined>(undefined);
	const longitude = ref<number | undefined>(undefined);

	function setLocation(location: ILocation): void {
		latitude.value = location.latitude;
		longitude.value = location.longitude;
		if (location.country) country.value = location.country;
		if (location.region) region.value = location.region;
	}

	return {
		country,
		region,
		latitude,
		longitude,
		setLocation
	};
});

export const useCountryStore = defineStore('country', {
	state: (): ICountry => ({
		code: '',
		name: '',
		regions: [],
	}),
	actions: {
		// 국가 설정 메서드
		setCountry({ country, region }: { country: string; region: string }): void {
			this.name = country;
			this.regions = [region];
		},
	},
});
