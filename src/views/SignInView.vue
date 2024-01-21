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
			<div class="button-wrap">
				<button
					@click="getCoordinate"
					:class="{
						'button button--positive': isValidLogin,
						'button button--disabled': !isValidLogin,
					}"
					role="link"
					id="loginBtn"
				>
					<!-- //버튼 활성 .button--positive / 비활성 .button--disabled -->
					로그인
				</button>
			</div>
		</div>
		<!-- login -->
		<div class="container">
			<button type="button" class="button-icon google">구글 로그인</button>
			<button type="button" class="button-icon kakao">카카오톡 로그인</button>
		</div>

		<div class="container">
			<ul>
				<li>
					<strong>비밀번호 분실</strong>
					<router-link to="/" class="button-text point-color"
						><span>비밀번호 찾기</span></router-link
					>
				</li>
				<li>
					<strong>회원이 아닌 경우</strong>
					<router-link to="/" class="button-text point-color"
						><span @click="onSignUp">가입하기</span></router-link
					>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import useAxios from '@/composables/useAxios.js';
import { computed, ref } from 'vue';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

const email = ref('');
const password = ref('');
const router = useRouter();
const { sendRequest } = useAxios();
const isValidLogin = computed(() => email.value && password.value);

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
		}
	} catch (error) {
		console.log(error);
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
	try {
		if ('geolocation' in navigator) {
			const permissionResult = await navigator.permissions.query({
				name: 'geolocation',
			});
			if (permissionResult.state === 'granted') {
				navigator.geolocation.getCurrentPosition(
					position => {
						signIn(position.coords.latitude, position.coords.longitude);
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
</script>
