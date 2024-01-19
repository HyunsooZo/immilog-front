<template>
	<main>
		<div id="app">
			<TheHeader> </TheHeader>
			<router-view />
		</div>
	</main>
</template>

<script setup>
import { useLocationStore } from './stores/location.js';
import { onMounted } from 'vue';
import TheHeader from './components/layouts/TheHeader.vue';

const successCallback = position => {
	useLocationStore().setLocation({
		latitude: position.coords.latitude,
		longitude: position.coords.longitude,
	});
};

const errorCallback = error => {
	// 위치 정보 가져오기 실패 시 동작
	console.error('Failed to get location:', error);
};

const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0,
};

onMounted(async () => {
	try {
		if ('geolocation' in navigator) {
			const permissionResult = await navigator.permissions.query({
				name: 'geolocation',
			});

			if (permissionResult.state === 'granted') {
				navigator.geolocation.getCurrentPosition(
					position => {
						successCallback(position);
					},
					errorCallback,
					options,
				);
			} else if (permissionResult.state === 'prompt') {
				const position = await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, options);
				});
				// store에 위치 정보 저장
				successCallback(position);
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
});
</script>
