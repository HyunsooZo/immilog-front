<template>
	<LoadingModal v-if="isLoading" />
	<TheHeader :showNotification="false" />
	<div class="content">
		<TheTopBox :title="t('profileEditView.profileEdit')" :text="t('profileEditView.profileEditText')" />
		<div class="container">
			<!-- userProfileUrl -->
			<div class="input-wrap">
				<div class="input__wrap input__attachments _edit">
					<div class="input__item">
						<div class="input__item_inner">
							<div class="input__file">
								<input type="file" id="file-upload" class="input__element" @change="previewImage" />
								<label for="file-upload" class="button" role="button">
									<span class="blind">프로필 사진 선택</span>
								</label>
							</div>
							<div class="item__display" :class="{ 'pic--default': !imagePreview }">
								<img v-if="imagePreview" :src="imagePreview" alt="Preview" />
								<button type="reset" class="button--del" @click="removeImage">
									<i class="blind">삭제</i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- nickname -->
			<div class="input-wrap">
				<em class="input__title">{{ t('profileEditView.nicknameChange') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userNickName" type="text" class="input__element"
								:placeholder="t('profieEditView.nicknameChangePlaceHolder')" />
						</div>
					</div>
					<button type="button" class="button button--primary" @click="checkNickName">
						{{ t('signUpView.duplicationCheck') }}
					</button>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="nickNameCheckDone && !isNickNameValid && isNickNameChanged" class="input__error" aria-live="assertive">
					{{ t('signUpView.alreadyInUse') }}
				</p>
				<p v-if="!nickNameCheckDone && !isNickNameValid && isNickNameChanged" class="input__error"
					aria-live="assertive">
					{{ t('signUpView.doDuplicationCheck') }}
				</p>
				<p v-if="nickNameCheckDone && isNickNameValid && isNickNameChanged" class="input__text" aria-live="assertive">
					{{ t('signUpView.availableNickname') }}
				</p>
			</div>
			<!-- country -->
			<div class="input-wrap">
				<em class="input__title">{{ t('profileEditView.changeCountry') }}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="country" type="text" class="input__element" :placeholder="t('profileEditView.country')"
								disabled />
						</div>
					</div>
					<button type="button" class="button button--primary" @click="fetchLocation">
						{{ t('profileEditView.fetchLocation') }}
					</button>
				</div>
			</div>

			<div class="button-wrap">
				<button class="button" role="link" :class="{
					'button--positive':
						(!nickNameCheckDone && !isNickNameChanged) ||
						(nickNameCheckDone && isNickNameValid) ||
						isImageChange ||
						country ||
						userNickName,
					'button--disabled':
						(!nickNameCheckDone && !isNickNameChanged) ||
						!nickNameCheckDone ||
						!isImageChange ||
						!isNickNameValid ||
						!country ||
						!userNickName,
				}" @click="saveProfile">
					{{ t('profileEditView.save') }}
				</button>
			</div>
		</div>
	</div>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	</teleport>
</template>

<script setup lang="ts">
import type { IApiImage, IApiLocation, IApiResponse } from '@/types/api-interface';
import type { ILocation } from '@/types/interface';
import { applicationJson, applicationJsonWithToken, multipartFormData } from '@/utils/header';
import { computed, onMounted, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { useLocationStore } from '@/stores/location.ts';
import { resizeImage } from '@/utils/image.ts';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AxiosResponse } from 'axios';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import api from '@/api';

const { t } = useI18n();

const router = useRouter();
const nickNameCheckDone = ref(false);
const isNickNameValid = ref(false);
const userInfo = useUserInfoStore();
const userNickName = ref();
const country = ref();
const imagePreview = ref();
const imageFile = ref(null);
const latitude = ref(0.0);
const longitude = ref(0.0);
const isLoading = ref(false);

const isNickNameChanged = computed(() => {
	return userNickName.value !== userInfo.userNickname;
});

const isImageChange = computed(() => {
	return imagePreview.value !== userInfo.userProfileUrl;
});

// 프리뷰 이미지
const previewImage = (event: { target: any; }) => {
	const input = event.target;
	if (input.files && input.files[0]) {
		const reader = new FileReader();
		reader.onload = e => {
			if (e.target) {
				imagePreview.value = e.target.result;
			}
			imageFile.value = input.files[0];
		};
		reader.readAsDataURL(input.files[0]);
	}
};

// 프리뷰이미지 삭제
const removeImage = () => {
	// 비어있는 이미지로 설정
	imagePreview.value = '';
	imageFile.value = null;
};

// 닉네임 중복 체크
const checkNickName = async () => {
	if (userNickName.value == userInfo.userNickname) {
		isNickNameValid.value = true;
		nickNameCheckDone.value = true;
		return;
	}
	try {
		const { status, data } = await api.get(
			`/users/nicknames?nickname=${userNickName.value}`,
			applicationJson,
		);
		if (status === 200) {
			isNickNameValid.value = data.data ? true : false;
			nickNameCheckDone.value = true;
		}
	} catch (error) {
		console.log(error);
	}
};

const hostImage = async () => {
	if (!imagePreview.value || !imageFile.value) {
		return;
	}
	try {
		const formData = new FormData();
		const resizedImage = await resizeImage(imageFile.value, 0.5);
		formData.append('multipartFile', resizedImage as Blob);
		const response: AxiosResponse<IApiImage> = await api.post(
			'/images?imagePath=profile',
			formData,
			multipartFormData,
		);
		if (response.status === 200) {
			imagePreview.value = response.data.data;
		} else {
			openAlert(t('profileEditView.failedToUploadImage'));
		}
	} catch (error) {
		console.log(error);
	}
};

const saveProfile = async () => {
	if (imageFile.value) {
		await hostImage();
	}
	const formData = {
		nickName:
			userNickName.value === userInfo.userNickname ? null : userNickName.value,
		country: country.value === userInfo.userCountry ? null : country.value,
		userProfileUrl:
			imagePreview.value === userInfo.userProfileUrl
				? null
				: imagePreview.value[0],
		latitude: latitude.value,
		longitude: longitude.value,
	};
	try {
		const response: AxiosResponse<IApiResponse> = await api.patch(
			'/users/information',
			formData,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			userInfo.userNickname = userNickName.value;
			userInfo.userCountry = country.value;
			userInfo.userProfileUrl = imagePreview.value;
			router.back();
		}
	} catch (error) {
		console.log(error);
	}
};

// <-- 알럿 관련
const alertValue = ref(false);
const alertText = ref('');

const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertText.value = '';
	alertValue.value = false;
};
// -->

const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0,
};

const errorCallback = (error: { code: any; message: any; }) => {
	console.error(`ERROR(${error.code}): ${error.message}`);
};

const fetchLocation = async () => {
	try {
		isLoading.value = true;
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
						isLoading.value = false;
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
				});
				isLoading.value = false;
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
				isLoading.value = false;
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
		isLoading.value = false;
	} finally {
		isLoading.value = false;
	}
};

const setCountryCoordinates = async (location: ILocation) => {
	latitude.value = location.latitude ? location.latitude : 0.0;
	longitude.value = location.longitude ? location.longitude : 0.0;
};

const getCountry = async (location: ILocation) => {
	setCountryCoordinates({
		latitude: location.latitude,
		longitude: location.longitude
	});
	try {
		const response: AxiosResponse<IApiLocation> = await api.get(
			`/locations?latitude=${location.latitude}&longitude=${location.longitude}`,
			multipartFormData,
		);
		if (response.status === 200) {
			country.value = response.data.data.country;
		} else {
			openAlert(t('profileEditView.failedToFetchLocationInfo'));
		}
	} catch (error) {
		console.log(error);
	}
};

onMounted(() => {
	userNickName.value = userInfo.userNickname;
	country.value = userInfo.userCountry;
	imagePreview.value = userInfo.userProfileUrl;
});
</script>
