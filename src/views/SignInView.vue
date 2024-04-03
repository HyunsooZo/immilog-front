<template>
	<LoadingModal v-if="isLoading" />

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
				<button type="button" class="button-text">
					<strong>비밀번호 재설정</strong>
				</button>
			</div>

			<div class="button-wrap">
				<button
					@click="signIn"
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

			<div class="input-wrap">
				<div class="input__wrap">
					<div class="input__item">
						<input
							type="checkbox"
							class="input__checkbox _text"
							id="loginSave"
							name="loginSave"
						/>
						<label for="loginSave" class="input__label">자동로그인</label>
					</div>
				</div>
			</div>
		</div>

		<!-- signin -->
		<div class="signin-group-wrap">
			<div class="title--small">
				<span>or login with</span>
			</div>
			<ul class="signin-group">
				<li class="item">
					<button type="button" class="button-icon button--signin-google">
						<i class="blind">구글 로그인</i>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button-icon button--signin-kakao">
						<i class="blind">카카오톡 로그인</i>
					</button>
				</li>
				<li class="item">
					<button type="button" class="button-icon button--signin-naver">
						<i class="blind">네이버 로그인</i>
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
						class="button-text"
						role="link"
						@click="onSignUp"
					>
						<strong>가입하기</strong>
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

<script setup lang="ts">
import { useRouter } from 'vue-router';
import useAxios from '@/composables/useAxios.ts';
import { computed, onMounted, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import { getCoordinate } from '@/services/geolocation.ts';
import { getUserInfo } from '@/services/userInfoFetch.ts';

const email = ref('');
const password = ref('');
const router = useRouter();
const { sendRequest } = useAxios(router);
const isValidLogin = computed(() => email.value && password.value);
const isLoading = ref(false);
const alertValue = ref(false);
const alertText = ref('');

const onSignUp = () => {
	router.push({ name: 'SignUp' });
};

const signIn = async () => {
	onLoading();
	try {
		const { status, data } = await sendRequest(
			'post',
			'/users/sign-in',
			{
				headers: {
					contentType: 'multipart/form-data',
				},
			},
			{
				email: email.value,
				password: password.value,
				latitude: localStorage.getItem('latitude'),
				longitude: localStorage.getItem('longitude'),
			},
		);

		if (status === 200) {
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
			localStorage.setItem('accessToken', data.data.accessToken);
			localStorage.setItem('refreshToken', data.data.refreshToken);
			setTimeout(() => {
				offLoading();
				router.push({ name: 'Home' });
			}, 2000);
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
		setTimeout(() => {
			offLoading();
		}, 2000);
	}
};

const openAlert = content => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};

const onLoading = () => {
	isLoading.value = true;
};

const offLoading = () => {
	isLoading.value = false;
};

onMounted(async () => {
	if (localStorage.getItem('accessToken')) {
		await getCoordinate();
		if (localStorage.getItem('latitude') && localStorage.getItem('longitude')) {
			const { status, data } = await getUserInfo(
				localStorage.getItem('latitude'),
				localStorage.getItem('longitude'),
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
		router.push({ name: 'Home' });
	}
});
</script>
