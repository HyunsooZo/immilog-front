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
			<!-- interest country -->
			<div class="input-wrap">
				<em class="input__title">{{ t('signUpView.interestCountry') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner" @click="openSelect">
							<input v-model="interestCountry" type="text" class="input__element"
								:placeholder="t('signUpView.interestCountryPlaceHolder')" readonly />
						</div>
					</div>
				</div>
			</div>
		</div>
		<SelectDialog v-if="isCountrySelectClicked" :title="countrySelectTitle" :list="countries" @close="closeSelect"
			@select:value="selectedValue" />
		<TheFooterButton :onClick="register" :condition="fullFilled && !isLoading" />
	</div>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	</teleport>
</template>

<script setup lang="ts">
import type { IApiBoolean, IApiLocation } from '@/types/api-interface';
import type { IError, ILocation, ISelectItem } from '@/types/interface';
import { computed, ref, watch } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocationStore } from '@/stores/location.ts';
import { useUserInfoStore } from '@/stores/userInfo';
import { applicationJson } from '@/utils/header';
import { countries } from '@/utils/selectItems'
import { AxiosResponse } from 'axios';
import TheTopBox from '@/components/search/TheTopBox.vue';
import TheFooterButton from '@/components/layouts/TheFooterButton.vue';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import api from '@/api';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const emailRegister = ref('');
const userNickName = ref('');
const userPassword = ref('');
const userPasswordConfirm = ref('');
const submitted = ref(false);
const country = ref(t('signUpView.noLocationInfo'));
const isCountrySelectClicked = ref(false);
const interestCountry = ref(userInfo.userInterestCountry);
const interestCountryCode = ref('');
const countrySelectTitle = t('profileEditView.selectCountry');
const region = ref('');
const isLoading = ref(false);
const isNickNameValid = ref(false);
const alertValue = ref(false);
const alertText = ref('');
const nickNameCheckDone = ref(false);
const passwordValidation = ref(false);
const passwordMatch = ref(false);
const router = useRouter();

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
				interestCountry: interestCountryCode.value,
				region: region.value,
				profileImage: null,
			};
			const response: AxiosResponse<void> = await api.post(
				'/users',
				formData,
				applicationJson,
			);

			if (response.status === 201) {
				onResult();
			} else {
				openAlert(response.statusText);
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

const errorCallback = (error: IError) => {
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
						getCountry({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude
						});
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
				getCountry({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				}
				);
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
};


const getCountry = async (location: ILocation) => {
	try {
		const response: AxiosResponse<IApiLocation> = await api.get(
			`/locations?latitude=${location.latitude}&longitude=${location.longitude}`,
			applicationJson,
		);
		if (response.data.status === 200) {
			country.value = response.data.data.country;
			region.value = response.data.data.region;
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
		const response: AxiosResponse<IApiBoolean> = await api.get(
			`/users/nicknames?nickname=${userNickName.value}`,
			applicationJson,
		);
		if (response.status === 200) {
			isNickNameValid.value = response.data.data ? true : false;
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


// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// select 관련 메소드 
const openSelect = (event: Event) => {
	event.preventDefault();
	isCountrySelectClicked.value = true;
	isModalOpen();
}

const closeSelect = () => {
	isCountrySelectClicked.value = false;
	isModalClose();
};

// select 관련 메소드 (선택된 값 처리)
const selectedValue = (value: ISelectItem) => {
	if (countries.some(c => c.code === value.code)) {
		interestCountry.value = t(value.name);
		interestCountryCode.value = value.code;
	}
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
