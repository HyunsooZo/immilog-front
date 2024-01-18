<template>
	<div>
		<div class="content">
			<div class="top-box">
				<div class="page-header">
					<span>로그인</span>
				</div>
				<div class="page-guide">
					<div class="tit-default"><span>서브타이틀</span></div>
					<p class="txt-default">안내 텍스트</p>
				</div>
			</div>

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
						@click="signIn"
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
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import useAxios from '@/composables/useAxios.js';
import { ref } from 'vue';
import { useLocationStore } from '@/stores/location.js';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

const email = ref('');
const password = ref('');
const router = useRouter();
const { sendRequest } = useAxios();

const onSignUp = () => {
	router.push({ name: 'SignUp' });
};

const signIn = async () => {
	try {
		const { status, data } = await sendRequest('post', '/users/sign-in', {
			email: email.value,
			password: password.value,
			latitude: useLocationStore().latitude,
			longitude: useLocationStore().longitude,
		});

		if (status === 200) {
			console.log(data.data);
			console.dir(data.data);
		}
	} catch (error) {
		console.log(error);
	}
};
</script>
