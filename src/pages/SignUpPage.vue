<template>
	<div class="content TheFooterButton">
		<TheTopBox
			:title="t('signUpView.signUp')"
			:text="t('signUpView.enterInformation')"
		/>
		<div class="container">
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.email') }}</em>
				<div class="input__wrap underline-type email-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="emailRegister"
								type="text"
								class="input__element"
								:placeholder="t('signUpView.emailPlaceHolder')"
								required
							/>
						</div>
					</div>
				</div>
				<p
					v-if="submitted && !isValidEmail"
					class="input__error"
					aria-live="assertive"
				>
					{{ t('signUpView.invalidEmailFormat') }}
				</p>
			</div>
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.nickname') }}</em>
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="userNickname"
								type="text"
								class="input__element"
								:placeholder="t('signUpView.nicknamePlaceHolder')"
								required
							/>
						</div>
					</div>
					<button
						type="button"
						class="button button--primary"
						@click="checkNickName"
					>
						{{ t('signUpView.duplicationCheck') }}
					</button>
				</div>
				<p
					v-if="nickNameCheckDone && !isNickNameValid"
					class="input__error"
					aria-live="assertive"
				>
					{{ t('signUpView.alreadyInUse') }}
				</p>
				<p
					v-if="nickNameCheckDone && isNickNameValid"
					class="input__text"
					aria-live="assertive"
				>
					{{ t('signUpView.availableNickname') }}
				</p>
			</div>
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.password') }}</em>
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="userPassword"
								type="password"
								class="input__element"
								:placeholder="t('signUpView.passwordPlaceHolder')"
								required
							/>
						</div>
					</div>
				</div>
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="userPasswordConfirm"
								type="password"
								class="input__element"
								:placeholder="t('signUpView.passwordConfirm')"
								required
							/>
						</div>
					</div>
				</div>
				<p
					v-if="submitted && !passwordMatch"
					class="input__error"
					aria-live="assertive"
				>
					{{ t('signUpView.passwordNotMatch') }}
				</p>
				<p
					v-if="submitted && !passwordValidation"
					class="input__error"
					aria-live="assertive"
				>
					{{ t('signUpView.passwordFormatNotMeet') }}
				</p>
			</div>
			<div class="input-wrap" aria-label="required">
				<em class="input__title">{{ t('signUpView.country') }}</em>
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="country"
								type="text"
								class="input__element"
								disabled
							/>
						</div>
					</div>
				</div>
			</div>
			<div class="input-wrap">
				<em class="input__title">{{ t('signUpView.interestCountry') }}</em>
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner" @click="openSelect">
							<input
								v-model="interestCountry"
								type="text"
								class="input__element"
								:placeholder="t('signUpView.interestCountryPlaceHolder')"
								readonly
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<SelectDialog
			v-if="isCountrySelectClicked"
			:title="countrySelectTitle"
			:list="countries"
			@close="closeSelect"
			@select:value="selectedValue"
		/>
		<TheFooterButton
			:onClick="register"
			:condition="fullFilled && !isLoading"
		/>
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
import type { IApiBoolean, IApiLocation } from '@/shared/types/location';
import type { IError, ILocation, ISelectItem } from '@/shared/types/common';
import { computed, ref, watch } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocationStore } from '@/shared/stores/location';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { applicationJson } from '@/shared/utils/header';
import { countries } from '@/shared/utils/selectItems';
import { AxiosResponse } from 'axios';
import TheTopBox from '@/shared/components/common/TheTopBox.vue';
import TheFooterButton from '@/shared/components/layout/TheFooterButton.vue';
import CustomAlert from '@/shared/components/ui/CustomAlert.vue';
import SelectDialog from '@/shared/components/ui/SelectDialog.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const emailRegister = ref('');
const userNickname = ref('');
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
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(emailRegister.value);
});

const fullFilled = computed(() => {
	return (
		emailRegister.value.trim() !== '' &&
		userNickname.value.trim() !== '' &&
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
		return;
	}
	if (overAllValidationCheck()) {
		try {
			isLoading.value = true;
			const formData = {
				email: emailRegister.value,
				nickName: userNickname.value,
				password: userPassword.value,
				country: country.value,
				interestCountry: interestCountryCode.value,
				region: region.value,
				profileImage: null,
			};
			const response: AxiosResponse<void> = await api.post(
				'/api/v1/users',
				formData,
				applicationJson,
			);

			if (response.status === 201) {
				onResult();
			} else {
				openAlert(response.statusText || t('signUpView.unexpectedError'));
			}
		} catch (error: any) {
			openAlert(
				error.response?.data?.message || t('signUpView.failedToSignUp'),
			);
		} finally {
			returnSubmitValues();
		}
	} else {
		returnSubmitValues();
	}
};

const checkNickName = async () => {
	try {
		const response: AxiosResponse<IApiBoolean> = await api.get(
			`/api/v1/users/nicknames/${userNickname.value}/availability`,
			applicationJson,
		);
		if (response.status === 200) {
			isNickNameValid.value = response.data.data ? true : false;
			nickNameCheckDone.value = true;
		}
	} catch (error) {
		console.error(error);
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

const isModalOpen = () => {
	document.body.classList.add('inactive');
};

const isModalClose = () => {
	document.body.classList.remove('inactive');
};

const openSelect = (event: Event) => {
	event.preventDefault();
	isCountrySelectClicked.value = true;
	isModalOpen();
};

const closeSelect = () => {
	isCountrySelectClicked.value = false;
	isModalClose();
};

const selectedValue = (value: ISelectItem) => {
	if (countries.some(c => c.code === value.code)) {
		interestCountry.value = t(value.name);
		interestCountryCode.value = value.code;
	}
};

onMounted(() => {
	getCoordinate();
});

const getCoordinate = async () => {
	const options = {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0,
	};

	const errorCallback = (error: IError) => {
		console.error(`ERROR(${error.code}): ${error.message}`);
	};

	try {
		if ('geolocation' in navigator) {
			const permissionResult = await navigator.permissions.query({
				name: 'geolocation',
			});
			if (permissionResult.state === 'granted') {
				navigator.geolocation.getCurrentPosition(
					position => {
						getCountry({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						});
					},
					errorCallback,
					options,
				);
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
};

const getCountry = async (location: ILocation) => {
	try {
		const response: AxiosResponse<IApiLocation> = await api.get(
			`/api/v1/locations?latitude=${location.latitude}&longitude=${location.longitude}`,
			applicationJson,
		);
		if (response.data.status === 200) {
			country.value = response.data.data.country || '';
			region.value = response.data.data.region || '';
		} else {
			openAlert(t('signUpView.failedToFetchLocationInfo'));
		}
	} catch (error) {
		console.error(error);
	}
};

const overAllValidationCheck = () => {
	return (
		emailRegister.value &&
		userNickname.value &&
		userPassword.value &&
		userPasswordConfirm.value &&
		passwordValidation.value &&
		passwordMatch.value &&
		isNickNameValid.value
	);
};

watch(
	() => userNickname.value,
	() => {
		isNickNameValid.value = false;
		nickNameCheckDone.value = false;
	},
);
</script>
