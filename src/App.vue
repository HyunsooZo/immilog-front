<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCoordinate } from '@/shared/services/geolocation';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import type { IApiUserInfo } from '@/features/user/types/index';
import { fetchUserInfo } from '@/features/user/services/auth.ts';
import { AxiosResponse } from 'axios';
import TheFooter from '@/shared/components/layout/TheFooter.vue';
import router from '@/core/router/index';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const route = useRoute();
const hideFooter = computed(() => route.meta.hideFooter);
const userInfo = useUserInfoStore();

const init = async () => {
	if (!localStorage.getItem('accessToken') || !localStorage.getItem('userId')) {
		return false;
	}
	const response: AxiosResponse<IApiUserInfo> | any = await fetchUserInfo(
		localStorage.getItem('accessToken'),
		localStorage.getItem('userId'),
	);
	if (response.data.status === 200 && response.status === 200) {
		localStorage.setItem(
			'accessToken',
			response.data.data.accessToken as string,
		);
		localStorage.setItem(
			'refreshToken',
			response.data.data.refreshToken as string,
		);
		userInfo.setUserInfo(response.data.data);
		userInfo.setUserInterestCountry(response.data.data.interestCountry);
		return true;
	} else {
		return false;
	}
};

onMounted(async () => {
	locale.value = localStorage.getItem('language') === 'en' ? 'en' : 'ko';
	await getCoordinate();
	if (!(await init())) {
		await nextTick();
		router.push('/sign-in');
	}
});
</script>
