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
	const accessToken = localStorage.getItem('accessToken');
	const userId = localStorage.getItem('userId');
	const refreshToken = localStorage.getItem('refreshToken');
	
	// accessToken과 userId가 둘 다 없으면 로그인 필요
	if (!accessToken || !userId) {
		// refreshToken이 있으면 토큰 갱신 시도
		if (refreshToken) {
			console.log('No accessToken/userId but refreshToken exists, attempting refresh...');
			try {
				const refreshResponse = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/v1/auth/refresh?token=${refreshToken}`);
				const refreshData = await refreshResponse.json();
				
				console.log('Manual refresh response:', refreshData);
				console.log('Refresh data contents:', JSON.stringify(refreshData.data, null, 2));
				
				if (refreshResponse.status === 200 && refreshData.status === 200) {
					const newAccessToken = refreshData.data.accessToken;
					const newRefreshToken = refreshData.data.refreshToken;
					const newUserId = refreshData.data.userId; // 백엔드 RefreshTokenResponse에서 userId 가져오기
					
					console.log('New tokens received:', {
						accessToken: newAccessToken ? 'YES' : 'NO',
						refreshToken: newRefreshToken ? 'YES' : 'NO', 
						userId: newUserId ? newUserId : 'NO'
					});
					
					localStorage.setItem('accessToken', newAccessToken);
					localStorage.setItem('refreshToken', newRefreshToken);
					localStorage.setItem('userId', newUserId); // 백엔드에서 제공하는 userId 저장
					
					console.log('Token refresh successful, retrying fetchUserInfo...');
					// 새 토큰으로 다시 시도 (무한루프 방지를 위해 직접 fetchUserInfo 호출)
					const accessToken = localStorage.getItem('accessToken');
					const userId = localStorage.getItem('userId');
					
					if (!accessToken || !userId) {
						console.error('Still missing accessToken or userId after refresh');
						return false;
					}
					
					// fetchUserInfo 직접 호출로 무한루프 방지
					try {
						console.log('Calling fetchUserInfo after token refresh...');
						const response: AxiosResponse<IApiUserInfo> | any = await fetchUserInfo(accessToken, userId);
						
						if (response.data.status === 200 && response.status === 200) {
							localStorage.setItem('accessToken', response.data.data.accessToken as string);
							localStorage.setItem('refreshToken', response.data.data.refreshToken as string);
							userInfo.setUserInfo(response.data.data);
							userInfo.setUserInterestCountry(response.data.data.interestCountry);
							return true;
						} else {
							console.log('fetchUserInfo failed after token refresh');
							return false;
						}
					} catch (error) {
						console.error('Error calling fetchUserInfo after token refresh:', error);
						return false;
					}
				} else {
					console.log('Token refresh failed:', refreshData);
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('userId');
					return false;
				}
			} catch (refreshError) {
				console.error('Token refresh error:', refreshError);
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				localStorage.removeItem('userId');
				return false;
			}
		} else {
			console.log('No accessToken, userId, or refreshToken found');
			return false;
		}
	}
	
	try {
		console.log('Calling fetchUserInfo with:', {
			accessToken: accessToken?.substring(0, 20) + '...',
			userId: userId
		});
		
		const response: AxiosResponse<IApiUserInfo> | any = await fetchUserInfo(
			accessToken,
			userId,
		);
		
		console.log('fetchUserInfo response:', response);
		
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
			console.log('fetchUserInfo failed with response:', response);
			return false;
		}
	} catch (error) {
		console.error('Error in init():', error);
		return false;
	}
};

onMounted(async () => {
	console.log('App.vue onMounted started');
	locale.value = localStorage.getItem('language') === 'en' ? 'en' : 'ko';
	console.log('Locale set to:', locale.value);
	
	await getCoordinate();
	console.log('Geolocation completed');
	
	console.log('Calling init()...');
	const initResult = await init();
	console.log('Init result:', initResult);
	
	if (!initResult) {
		console.log('Init failed, redirecting to sign-in');
		await nextTick();
		router.push('/sign-in');
	} else {
		console.log('Init successful, staying on current page');
	}
});
</script>
