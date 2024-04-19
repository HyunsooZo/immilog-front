<template>
	<div class="content TheFooterButton">
		<!-- //TheFooterButton -->
		<TheTopBox :title="t('signUpView.signUp')" :text="t('signUpView.enterInformation')" />
		<!-- 회원가입 -->
		<div class="container">
			<!-- e-mail -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.email') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type email-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="emailRegister" type="text" class="input__element"
								:placeholder="t('signUpView.emailPlaceHolder')" required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !isValidEmail" class="input__error" aria-live="assertive">
					{{ t('signUpView.invalidEmailFormat') }}
				</p>
			</div>
			<!-- nickname -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.nickname') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userNickName" type="text" class="input__element"
								:placeholder="t('signUpView.nicknamePlaceHolder')" required />
						</div>
					</div>
					<button type="button" class="button button--primary" @click="checkNickName">
						{{ t('signUpView.duplicationCheck') }}
					</button>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="nickNameCheckDone && !isNickNameValid" class="input__error" aria-live="assertive">
					{{ t('signUpView.alreadyInUse') }}
				</p>
				<p v-if="nickNameCheckDone && isNickNameValid" class="input__text" aria-live="assertive">
					{{ t('signUpView.availableNickname') }}
				</p>
			</div>

			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.password') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								:placeholder="t('signUpView.passwordPlaceHolder')" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element"
								:placeholder="t('signUpView.passwordConfirm')" required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					{{ t('signUpView.passwordNotMatch') }}
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					{{ t('signUpView.passwordFormatNotMeet') }}
				</p>
			</div>

			<!-- country -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.country') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="country" type="text" class="input__element" disabled />
						</div>
					</div>
				</div>
			</div>
		</div>
		<TheFooterButton :onClick="register" :condition="fullFilled && !isLoading" />
	</div>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	</teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocationStore } from '@/stores/location.ts';
import useAxios from '@/composables/useAxios.ts';
import TheTopBox from '@/components/search/TheTopBox.vue';
import TheFooterButton from '@/components/layouts/TheFooterButton.vue';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import axios from 'axios';
import { IApiLocation, IApiResponse } from '@/types/api-interface';
import { applicationJson } from '@/utils/header';

const { t } = useI18n();

const emailRegister = ref('');
const userNickName = ref('');
const userPassword = ref('');
const userPasswordConfirm = ref('');
const submitted = ref(false);
const country = ref(t('signUpView.noLocationInfo'));
const region = ref('');
const isLoading = ref(false);
const isNickNameValid = ref(false);
const alertValue = ref(false);
const alertText = ref('');
const nickNameCheckDone = ref(false);
const passwordValidation = ref(false);
const passwordMatch = ref(false);
const router = useRouter();
const { sendRequest } = useAxios(router);

const isValidEmail = computed(() => {
	// 간단한 이메일 형식 체크 정규 표현식
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(emailRegister.value);
});

//입력값 검증
const fullFilled = computed(() => {
	return (
		emailRegister.value.trim() !== '' &&
		userNickName.value.trim() !== '' &&
		userPassword.value.trim() !== '' &&
		userPasswordConfirm.value.trim() !== ''
	);
});

const register = async () => {
	submitted.value = true;
	passwordValidationCheck();
	passwordConfirmMatch();
	if (!passwordMatch.value || !passwordValidation.value) {
		return;
	}
	if (!isNickNameValid.value) {
		openAlert(t('signUpView.doDuplicationCheck'));
	}
	if (overAllValidationCheck()) {
		try {
			isLoading.value = true;
			const formData = {
				email: emailRegister.value,
				nickName: userNickName.value,
				password: userPassword.value,
				country: country.value,
				region: region.value,
				profileImage: null,
			};
			const reponse: IApiResponse<void> = await axios.post(
				'/users',
				formData,
				{
					headers: {
						contentType: 'multipart/form-data',
					},
				},
			);

			if (reponse.status === 201) {
				onResult();
			} else {
				openAlert(reponse.message);
				returnSubmitValues();
			}
		} catch (error) {
			console.log(error);
			returnSubmitValues();
		}
	} else {
		returnSubmitValues();

		return;
	}
};
const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0,
};

const errorCallback = (error: { code: any; message: any; }) => {
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
					(position: GeolocationPosition) => {
						getCountry(position.coords.latitude, position.coords.longitude);
						useLocationStore().setLocation({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude
						});
					},
					errorCallback,
					options,
				);
			} else if (permissionResult.state === 'prompt') {
				const position = await new Promise<GeolocationPosition>((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, options);
				});
				getCountry(position.coords.latitude, position.coords.longitude);
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
};


const getCountry = async (latitude: number, longitude: number) => {
	try {
		const response: IApiResponse<IApiLocation> = await axios.get(
			`/locations?latitude=${latitude}&longitude=${longitude}`,
			applicationJson,
		);
		if (response.status === 200) {
			country.value = response.data.country;
			region.value = response.data.region;
		} else {
			openAlert(t('signUpView.failedToFetchLocationInfo'));
		}
	} catch (error) {
		console.log(error);
	}
};

const overAllValidationCheck = () => {
	return emailRegister.value &&
		userNickName.value &&
		userPassword.value &&
		userPasswordConfirm.value &&
		passwordValidation.value &&
		passwordMatch.value &&
		isNickNameValid.value
};

const checkNickName = async () => {
	try {
		const response: IApiResponse<Boolean> = await axios.get(
			`/users/nicknames?nickname=${userNickName.value}`,
			applicationJson,
		);
		if (response.status === 200) {
			isNickNameValid.value = response.data ? true : false;
			nickNameCheckDone.value = true;
		}
	} catch (error) {
		console.log(error);
	}
};

const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};

const passwordValidationCheck = () => {
	const regex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
	passwordValidation.value = regex.test(userPassword.value);
};

const passwordConfirmMatch = () => {
	passwordMatch.value = userPassword.value === userPasswordConfirm.value;
};

const returnSubmitValues = () => {
	isLoading.value = false;
	submitted.value = false;
};

const onResult = () => {
	router.push({
		name: 'Result',
		query: {
			titleEmphasis: t('signUpView.signUpVerificationEmailHasBeenSent'),
			content: t('signUpView.thruVerificationEmail'),
		},
	});
};

onMounted(() => {
	getCoordinate();
});

watch(
	() => userNickName.value,
	() => {
		isNickNameValid.value = false;
		nickNameCheckDone.value = false;
	},
);
</script>
