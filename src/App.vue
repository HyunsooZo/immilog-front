<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TheFooter from './components/layouts/TheFooter.vue';
import { getCoordinate } from '@/services/geolocation.ts';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { getUserInfo } from './services/userInfoFetch.ts';

const route = useRoute();
const hideFooter = computed(() => route.meta.hideFooter);

onMounted(async () => {
	await getCoordinate();
	const lat = localStorage.getItem('latitude');
	const lon = localStorage.getItem('longitude');
	if (lat && lon) {
		const { status, data } = await getUserInfo(
			parseFloat(lat ? lat : '0'),
			parseFloat(lon ? lon : '0'),
		);
		if (status === 200 || status === 201) {
			localStorage.setItem('accessToken', data.data.accessToken);
			localStorage.setItem('refreshToken', data.data.refreshToken);
			useUserInfoStore().setUserInfo(
				data.data.userSeq,
				data.data.accessToken,
				data.data.refreshToken,
				data.data.nickname,
				data.data.email,
				data.data.country,
				data.data.region,
				data.data.userProfileUrl,
				data.data.isLocationMatch,
			);
		}
	}
});
</script>
