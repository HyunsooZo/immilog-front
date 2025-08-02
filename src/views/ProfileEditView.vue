<template>
	<LoadingModal v-if="isLoading" />
	<TheHeader :showNotification="false" />
	<div class="content">
		<TheTopBox
			:title="t('profileEditView.profileEdit')"
			:text="t('profileEditView.profileEditText')"
		/>
		<div class="container">
			<!-- userProfileUrl -->
			<div class="input-wrap">
				<div class="input__wrap input__attachments _edit">
					<div class="input__item">
						<div class="input__item_inner">
							<div class="input__file">
								<input
									type="file"
									id="file-upload"
									class="input__element"
									@change="previewImage"
								/>
								<label for="file-upload" class="button" role="button">
									<span class="blind">프로필 사진 선택</span>
								</label>
							</div>
							<div
								class="item__display"
								:class="{ 'image--default': !imagePreview }"
							>
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
							<input
								v-model="userNickName"
								type="text"
								class="input__element"
								:placeholder="t('profileEditView.nicknameChangePlaceHolder')"
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
				<!-- 에러 메시지 -->
				<p
					v-if="nickNameCheckDone && !isNickNameValid && isNickNameChanged"
					class="input__error"
					aria-live="assertive"
				>
					{{ t('signUpView.alreadyInUse') }}
				</p>
				<p
					v-if="!nickNameCheckDone && !isNickNameValid && isNickNameChanged"
					class="input__error"
					aria-live="assertive"
				>
					{{ t('signUpView.doDuplicationCheck') }}
				</p>
				<p
					v-if="nickNameCheckDone && isNickNameValid && isNickNameChanged"
					class="input__text"
					aria-live="assertive"
				>
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
							<input
								v-model="country"
								type="text"
								class="input__element"
								:placeholder="t('profileEditView.country')"
								disabled
							/>
						</div>
					</div>
					<button
						type="button"
						class="button button--primary"
						@click="fetchLocation"
					>
						{{ t('profileEditView.fetchLocation') }}
					</button>
				</div>
			</div>
			<!-- interested country -->
			<div class="input-wrap">
				<em class="input__title">{{
					t('profileEditView.changeInterestedCountry')
				}}</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner" @click="openSelect">
							<input
								v-model="interestCountry"
								type="text"
								class="input__element"
								:placeholder="t('profileEditView.interestCountry')"
								readonly
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="button-wrap">
				<button class="button" :class="buttonClass" @click="saveProfile">
					{{ t('profileEditView.save') }}
				</button>
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
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert
			:alertValue="alertValue"
			:alertText="alertText"
			@update:alertValue="closeAlert"
		/>
	</teleport>
</template>

<script setup lang="ts">
import type {
	IApiImage,
	IApiLocation,
	IApiResponse,
} from '@/types/api-interface';
import type { ILocation, ISelectItem } from '@/types/interface';
import {
	applicationJson,
	applicationJsonWithToken,
	multipartFormData,
} from '@/utils/header';
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { useLocationStore } from '@/stores/location.ts';
import { resizeImage } from '@/utils/image.ts';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { countries } from '@/utils/selectItems';
import { AxiosResponse } from 'axios';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import api from '@/api';

const { t } = useI18n();

const router = useRouter();
const nickNameCheckDone = ref(false);
const isNickNameValid = ref(false);
const userInfo = useUserInfoStore();
const userNickName = ref('');
const country = ref('');
const countryCode = ref('');
const interestCountry = ref('');
const interestCountryCode = ref('');
const isCountrySelectClicked = ref(false);
const countrySelectTitle = t('profileEditView.selectCountry');
const imagePreview = ref('');
const imageUrl = ref('');
const imageFile = shallowRef<File | null>(null);
const latitude = ref(parseFloat(localStorage.getItem('latitude') ?? '0.0'));
const longitude = ref(parseFloat(localStorage.getItem('longitude') ?? '0.0'));
const isLoading = ref(false);

const isNickNameChanged = computed(
	() => userNickName.value !== userInfo.userNickname,
);

const isInterestCountryChanged = computed(
	() => interestCountry.value !== userInfo.userInterestCountry,
);

const isCountryChanged = computed(
	() => countryCode.value && countryCode.value !== userInfo.userCountry,
);

const isImageChanged = computed(
	() => imagePreview.value !== userInfo.userProfileUrl,
);

const hasValidChanges = computed(
	() =>
		isInterestCountryChanged.value ||
		(nickNameCheckDone.value &&
			isNickNameValid.value &&
			isNickNameChanged.value) ||
		isImageChanged.value ||
		isCountryChanged.value,
);

const buttonClass = computed(() =>
	hasValidChanges.value ? 'button--positive' : 'button--disabled',
);

const previewImage = (event: Event) => {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) return;

	const reader = new FileReader();
	reader.onload = e => {
		if (e.target?.result) {
			imagePreview.value = e.target.result as string;
			imageFile.value = file;
		}
	};
	reader.readAsDataURL(file);
};

const removeImage = () => {
	imagePreview.value = '';
	imageFile.value = null;
	imageUrl.value = '';

	const fileInput = document.getElementById('file-upload') as HTMLInputElement;
	if (fileInput) fileInput.value = '';
};

const checkNickName = async () => {
	if (userNickName.value === userInfo.userNickname) {
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
			isNickNameValid.value = Boolean(data.data);
			nickNameCheckDone.value = true;
		}
	} catch (error) {
		console.error('Nickname check error:', error);
	}
};

const hostImage = async () => {
	if (!imagePreview.value || !imageFile.value) return;

	try {
		const formData = new FormData();
		const resizedImage = await resizeImage(imageFile.value, 0.5);

		formData.append('multipartFile', resizedImage as Blob);
		formData.append('imagePath', 'profile');
		formData.append('imageType', 'PROFILE');

		const response: AxiosResponse<IApiImage> = await api.post(
			'/images',
			formData,
			multipartFormData,
		);

		if (response.status === 200) {
			imageUrl.value = Array.isArray(response.data.data)
				? response.data.data[0]
				: response.data.data;
		} else {
			openAlert(t('profileEditView.failedToUploadImage'));
		}
	} catch (error) {
		console.error('Image upload error:', error);
		openAlert(t('profileEditView.failedToUploadImage'));
	}
};

const saveProfile = async () => {
	if (!hasValidChanges.value) return;

	if (imageFile.value) {
		await hostImage();
	}

	const formData = {
		nickName: isNickNameChanged.value ? userNickName.value : null,
		country: isCountryChanged.value ? countryCode.value : null,
		interestCountry: isInterestCountryChanged.value
			? interestCountryCode.value
			: null,
		profileImage: isImageChanged.value
			? Array.isArray(imageUrl.value)
				? imageUrl.value[0]
				: imageUrl.value
			: null,
		latitude: latitude.value,
		longitude: longitude.value,
	};

	try {
		const response: AxiosResponse<IApiResponse> = await api.patch(
			`/users/${userInfo.userSeq}/information`,
			formData,
			applicationJsonWithToken(userInfo.accessToken),
		);

		if (response.status === 200) {
			updateUserInfo();
			router.back();
		}
	} catch (error) {
		console.error('Profile save error:', error);
	}
};

const updateUserInfo = () => {
	if (isNickNameChanged.value) {
		userInfo.userNickname = userNickName.value;
	}
	if (isImageChanged.value) {
		userInfo.userProfileUrl = imagePreview.value;
	}
	if (isCountryChanged.value) {
		userInfo.userCountry = countryCode.value;
	}
	if (isInterestCountryChanged.value) {
		userInfo.userInterestCountry = interestCountryCode.value;
	}
};

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

const openSelect = (event: Event) => {
	event.preventDefault();
	isCountrySelectClicked.value = true;
	document.body.classList.add('inactive');
};

const closeSelect = () => {
	isCountrySelectClicked.value = false;
	document.body.classList.remove('inactive');
};

const selectedValue = (value: ISelectItem) => {
	if (countries.some(c => c.code === value.code)) {
		interestCountry.value = t('countries.' + value.code);
		interestCountryCode.value = value.code;
	}
};

const geolocationOptions = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0,
};

const handleGeolocationError = (error: GeolocationPositionError) => {
	console.error(`Geolocation error (${error.code}): ${error.message}`);
	isLoading.value = false;
};

const fetchLocation = async () => {
	if (!('geolocation' in navigator)) return;

	try {
		isLoading.value = true;
		const permissionResult = await navigator.permissions.query({
			name: 'geolocation',
		});

		const handlePosition = (position: GeolocationPosition) => {
			const coords = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			getCountry(coords);
			useLocationStore().setLocation(coords);
			isLoading.value = false;
		};

		if (permissionResult.state === 'granted') {
			navigator.geolocation.getCurrentPosition(
				handlePosition,
				handleGeolocationError,
				geolocationOptions,
			);
		} else if (permissionResult.state === 'prompt') {
			const position = await new Promise<GeolocationPosition>(
				(resolve, reject) => {
					navigator.geolocation.getCurrentPosition(
						resolve,
						reject,
						geolocationOptions,
					);
				},
			);
			handlePosition(position);
		} else {
			console.error('Geolocation permission denied');
			isLoading.value = false;
		}
	} catch (error) {
		console.error('Failed to get location:', error);
		isLoading.value = false;
	}
};

const getCountry = async (location: ILocation) => {
	latitude.value = location.latitude || 0.0;
	longitude.value = location.longitude || 0.0;

	try {
		const response: AxiosResponse<IApiLocation> = await api.get(
			`/locations?latitude=${location.latitude}&longitude=${location.longitude}`,
			multipartFormData,
		);
		if (response.status === 200) {
			country.value = t('countries.' + response.data.data.country);
			countryCode.value = response.data.data.country;
		} else {
			openAlert(t('profileEditView.failedToFetchLocationInfo'));
		}
	} catch (error) {
		console.error('Location fetch error:', error);
		openAlert(t('profileEditView.failedToFetchLocationInfo'));
	}
};

onMounted(() => {
	userNickName.value = userInfo.userNickname || '';
	country.value = userInfo.userCountry
		? t('countries.' + userInfo.userCountry)
		: '';
	countryCode.value = userInfo.userCountry || '';
	imagePreview.value = userInfo.userProfileUrl || '';
	interestCountry.value = userInfo.userInterestCountry
		? t('countries.' + userInfo.userInterestCountry)
		: '';
	interestCountryCode.value = userInfo.userInterestCountry || '';
});
</script>
