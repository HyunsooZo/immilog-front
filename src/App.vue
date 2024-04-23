<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCoordinate } from '@/services/geolocation.ts';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { IApiUserInfo } from './types/api-interface.ts';
import axios, { AxiosResponse } from 'axios';
import TheFooter from './components/layouts/TheFooter.vue';
import { applicationJsonWithToken } from './utils/header.ts';

const route = useRoute();
const hideFooter = computed(() => route.meta.hideFooter);
const userInfo = useUserInfoStore();

onMounted(async () => {
	await getCoordinate();
	const latitude = localStorage.getItem('latitude');
	const longitude = localStorage.getItem('longitude');
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	if (accessToken && refreshToken) {
		const response: AxiosResponse<IApiUserInfo> = await axios.post(
			`/api/v1/auth/user?latitude=${latitude ? latitude : 0.0}&longitude=${longitude ? longitude : 0.0}`,
			applicationJsonWithToken
		);
		if (response.status === 200 || response.status === 201) {
			localStorage.setItem('accessToken', response.data.data.accessToken as string);
			localStorage.setItem('refreshToken', response.data.data.refreshToken as string);
			userInfo.setUserInfo(response.data.data);
		}
	}
});
</script>
