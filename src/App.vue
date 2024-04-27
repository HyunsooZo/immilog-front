<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCoordinate } from '@/services/geolocation.ts';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { IApiUserInfo } from './types/api-interface.ts';
import { fetchUserInfo } from './services/auth.ts';
import { AxiosResponse } from 'axios';
import TheFooter from './components/layouts/TheFooter.vue';
import router from './router/index.ts';


const route = useRoute();
const hideFooter = computed(() => route.meta.hideFooter);
const userInfo = useUserInfoStore();

const init = async () => {
	const response: AxiosResponse<IApiUserInfo> | any = await fetchUserInfo(localStorage.getItem('accessToken'));
	if (response.data.status === 200 || response.status === 201) {
		localStorage.setItem('accessToken', response.data.data.accessToken as string);
		localStorage.setItem('refreshToken', response.data.data.refreshToken as string);
		userInfo.setUserInfo(response.data.data);
		return true;
	} else {
		return false;
	}
}

onMounted(async () => {
	await getCoordinate();
	if (!await init()) {
		await nextTick()
		router.push('/sign-in');
	}
});
</script>
