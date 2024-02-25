<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup>
import { computed, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheFooter from './components/layouts/TheFooter.vue';
import useAxios from './composables/useAxios';
import { getCoordinate } from '@/services/geolocation.js';
import { getUserInfo } from '@/services/userInfoFetch';

const { sendRequest } = useAxios();
const route = useRoute();
const hideFooter = computed(() => route.meta.hideFooter);

onMounted(async () => {
	await getCoordinate();
	nextTick(async () => {
		if (
			localStorage.getItem('latitude') &&
			localStorage.getItem('longitude') &&
			localStorage.getItem('accessToken') &&
			localStorage.getItem('refreshToken')
		) {
			await getUserInfo(
				sendRequest,
				localStorage.getItem('latitude'),
				localStorage.getItem('longitude.value'),
			);
		}
	});
});
</script>
