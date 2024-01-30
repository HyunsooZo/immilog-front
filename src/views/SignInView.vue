<template>
	<div class="content">
		<!-- 로그인 -->
		<div class="container">
			<!-- email -->
			<div class="input-wrap">
				<em class="input__title">이메일</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="email"
								type="text"
								class="input__element"
								placeholder="이메일"
								id="inputEmail"
								required
							/>
						</div>
					</div>
				</div>
			</div>
			<!-- password -->
			<div class="input-wrap">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="password"
								type="password"
								class="input__element"
								placeholder="비밀번호"
								id="inputPassword"
								required
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="button-wrap link-type">
				<button type="button" class="button-text point-color">
					<span>비밀번호 재설정</span>
				</button>
			</div>

			<div class="button-wrap">
				<button
					@click="getCoordinate"
					:class="{
						'button button--positive': isValidLogin && !isLoading,
						'button button--disabled': !isValidLogin || isLoading,
					}"
					role="link"
					id="loginBtn"
				>
					로그인</button
				><!-- //버튼 활성 .button--positive / 비활성 .button--disabled -->
			</div>
		</div>

		<!-- login -->
		<div class="login-group-wrap">
			<div class="title--small center">
				<span>or login with</span>
			</div>
			<ul class="login-group">
				<li class="item">
					<button type="button" class="button-icon button--login-google">
						<span>구글 로그인</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button-icon button--login-kakao">
						<span>카카오톡 로그인</span>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button-icon button--login-naver">
						<span>네이버 로그인</span>
					</button>
				</li>
			</ul>
		</div>

		<div class="container">
			<ul>
				<li>
					<strong>회원이 아닌 경우</strong>
					<button
						type="button"
						class="button-text point-color"
						@click="onSignUp"
					>
						<span>가입하기</span>
					</button>
				</li>
			</ul>
		</div>
	</div>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert
			:alertValue="alertValue"
			:alertText="alertText"
			@update:alertValue="closeAlert"
		/>
	</teleport>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import useAxios from '@/composables/useAxios.js';
import { computed, onMounted, ref } from 'vue';
import { useLocationStore } from '@/stores/location.js';
import { useUserInfoStore } from '@/stores/userInfo.js';
import CustomAlert from '@/components/modal/CustomAlert.vue';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

const email = ref('');
const password = ref('');
const router = useRouter();
const { sendRequest } = useAxios();
const isValidLogin = computed(() => email.value && password.value);
const lat = useLocationStore.latitude;
const lon = useLocationStore.longitude;
const isLoading = ref(false);
const alertValue = ref(false);
const alertText = ref('');

const onSignUp = () => {
	router.push({ name: 'SignUp' });
};

const signIn = async (latitude, longitude) => {
	try {
		const { status, data } = await sendRequest('post', '/users/sign-in', {
			email: email.value,
			password: password.value,
			latitude: latitude,
			longitude: longitude,
		});

		if (status === 200) {
			console.log(data.data);
			console.dir(data.data);
			useUserInfoStore().setUserInfo(
				data.data.accessToken,
				data.data.nickname,
				data.data.email,
				data.data.country,
				data.data.userProfileUrl,
				data.data.isLocationMatch,
			);
			localStorage.setItem('accessToken', data.data.accessToken);
			router.push({ name: 'Home' });
		} else {
			password.value = '';
			openAlert(
				'로그인에 실패했습니다. <br/> 이메일과 비밀번호를 확인해 주세요.',
			);
		}
	} catch (error) {
		console.log(error);
		openAlert('서버와의 통신에 실패했습니다.');
	} finally {
		isLoading.value = false;
	}
};

const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0,
};

const errorCallback = error => {
	console.error(`ERROR(${error.code}): ${error.message}`);
};

const getCoordinate = async () => {
	isLoading.value = true;
	try {
		if (lat && lon) {
			signIn(lat, lon);
		} else if ('geolocation' in navigator) {
			const permissionResult = await navigator.permissions.query({
				name: 'geolocation',
			});
			if (permissionResult.state === 'granted') {
				navigator.geolocation.getCurrentPosition(
					position => {
						signIn(position.coords.latitude, position.coords.longitude);
						useLocationStore().setLocation(
							position.coords.latitude,
							position.coords.longitude,
						);
					},
					errorCallback,
					options,
				);
			} else if (permissionResult.state === 'prompt') {
				const position = await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, options);
				});
				signIn(position.coords.latitude, position.coords.longitude);
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
};

const openAlert = content => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};

onMounted(() => {
	if (localStorage.getItem('accessToken')) {
		router.push({ name: 'Home' });
	}
});
</script>
