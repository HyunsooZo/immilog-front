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

onMounted(async () => {
	try {
		if ('geolocation' in navigator) {
			const position = await new Promise((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject, {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				});
			});

			// store에 위치 정보 저장
			useLocationStore().setLocation({
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			});

			console.log('Latitude:', useLocationStore().latitude);
			console.log('Longitude:', useLocationStore().longitude);
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
});
</script>

<style scoped></style>
