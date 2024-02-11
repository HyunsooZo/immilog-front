<template>
	<main>
		<router-view />
		<TheFooter v-if="!hideFooter" />
	</main>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TheFooter from './components/layouts/TheFooter.vue';
import useAxios from './composables/useAxios';
import { useUserInfoStore } from '@/stores/userInfo.js';

const { sendRequest } = useAxios();
const route = useRoute();
const router = useRouter();
const hideFooter = computed(() => route.meta.hideFooter);
const latitude = ref(0);
const longitude = ref(0);

const getUserInfo = async (latitude, longitude) => {
	try {
		const { status, data } = await sendRequest(
			'get',
			`/auth/user?latitude=${latitude}&longitude=${longitude}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			},
			null,
		);
		if (status === 200) {
			useUserInfoStore().setUserInfo(
				data.data.userSeq,
				data.data.accessToken,
				data.data.refreshToken,
				data.data.nickname,
				data.data.email,
				data.data.country,
				data.data.userProfileUrl,
				data.data.isLocationMatch,
			);
		} else {
			const response = await refreshToken();
			if (response) {
				getUserInfo();
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const refreshToken = async () => {
	try {
		const { status, data } = await sendRequest(
			'get',
			'/auth/refresh?token=' + localStorage.getItem('refreshToken'),
		);
		if (status === 200) {
			useUserInfoStore().setAccessToken(data.data.accessToken);
			useUserInfoStore().setRefreshToken(data.data.refreshToken);
			localStorage.setItem('accessToken', data.data.accessToken);
			localStorage.setItem('refreshToken', data.data.refreshToken);
			return true;
		} else if (status === 404) {
			localStorage.clear();
			router.push('/sign-in');
			return false;
		}
	} catch (error) {
		if (error.response && error.response.status === 404) {
			localStorage.clear();
			router.push('/sign-in');
			return false;
		}
	}
};

const getCoordinate = () => {
	return new Promise((resolve, reject) => {
		if ('geolocation' in navigator) {
			navigator.permissions
				.query({ name: 'geolocation' })
				.then(permissionResult => {
					if (
						permissionResult.state === 'granted' ||
						permissionResult.state === 'prompt'
					) {
						navigator.geolocation.getCurrentPosition(
							position => {
								latitude.value = position.coords.latitude;
								longitude.value = position.coords.longitude;
								localStorage.setItem('latitude', latitude.value);
								localStorage.setItem('longitude', longitude.value);
								resolve();
							},
							error => {
								console.error(`ERROR(${error.code}): ${error.message}`);
								reject(error);
							},
						);
					} else if (permissionResult.state === 'denied') {
						console.error('Geolocation permission denied.');
						reject(new Error('Geolocation permission denied.'));
					}
				})
				.catch(error => {
					console.error('Failed to get location:', error);
					reject(error);
				});
		} else {
			reject(new Error('Geolocation is not supported by this browser.'));
		}
	});
};

onMounted(async () => {
	if (!localStorage.getItem('latitude') && localStorage.getItem('longitude')) {
		await getCoordinate();
	}
	if (
		localStorage.getItem('latitude') &&
		localStorage.getItem('longitude') &&
		localStorage.getItem('accessToken')
	) {
		await getUserInfo(
			localStorage.getItem('latitude'),
			localStorage.getItem('longitude'),
		);
	}
});
</script>
