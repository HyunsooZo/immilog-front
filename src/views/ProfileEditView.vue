<template>
	<LoadingModal v-if="isLoading" />
	<TheHeader />
	<div class="content">
		<TheTopBox :title="'프로필 수정'" :text="'프로필 수정 후 확인 버튼을 눌러주세요.'" />
		<div class="container">
			<!-- profileimage -->
			<div class="input-wrap">
				<!-- <em class="input__title">프로필 사진</em> -->
				<!-- input__wrap -->
				<div class="input__wrap input__attachments _edit">
					<div class="input__item">
						<div class="input__item_inner">
							<div class="input__file">
								<input type="file" id="file-upload" class="input__element" @change="previewImage" />
								<label for="file-upload" class="button" role="button">
									<span class="blind">프로필 사진 선택</span>
								</label>
							</div>
							<div class="item__display" :class="{
		'pic--default': !imagePreview,
	}">
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
				<em class="input__title">닉네임 변경</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userNickName" type="text" class="input__element" placeholder="닉네임 입력(5~10자 한글, 영문, 숫자 조합)"
								value="현수쓰" />
						</div>
					</div>
					<button type="button" class="button button--primary" @click="checkNickName">
						중복확인
					</button>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="nickNameCheckDone && !isNickNameValid && isNickNameChanged" class="input__error" aria-live="assertive">
					이미 사용중인 닉네임 입니다.
				</p>
				<p v-if="!nickNameCheckDone && !isNickNameValid && isNickNameChanged" class="input__error"
					aria-live="assertive">
					닉네임 중복체크를 진행 해주세요.
				</p>
				<p v-if="nickNameCheckDone && isNickNameValid && isNickNameChanged" class="input__text" aria-live="assertive">
					사용 가능한 닉네임입니다.
				</p>
			</div>
			<!-- country -->
			<div class="input-wrap">
				<em class="input__title">접속 국가 변경</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="country" type="text" class="input__element" placeholder="지역" value="대한민국" disabled />
						</div>
					</div>
					<button type="button" class="button button--primary" @click="fetchLocation">
						위치가져오기
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
					저장
				</button>
			</div>
		</div>
	</div>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	</teleport>
</template>

<script setup lang="ts">
import TheHeader from '@/components/layouts/TheHeader.vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { useLocationStore } from '@/stores/location.ts';
import { computed, onMounted, ref } from 'vue';
import { resizeImage } from '@/utils/image.ts';
import useAxios from '@/composables/useAxios.ts';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { sendRequest } = useAxios();
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
	return imagePreview.value !== userInfo.userProfile;
});

// 프리뷰 이미지
const previewImage = event => {
	const input = event.target;
	if (input.files && input.files[0]) {
		const reader = new FileReader();
		reader.onload = e => {
			imagePreview.value = e.target.result;
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
		const { status, data } = await sendRequest(
			'get',
			`/users/nicknames?nickname=${userNickName.value}`,
			{
				headers: {
					contentType: 'multipart/form-data',
				},
			},
			null,
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
		formData.append('multipartFile', resizedImage);
		const { status, data } = await sendRequest(
			'post',
			'/images?imagePath=profile',
			{
				headers: {
					contentType: 'multipart/form-data',
				},
			},
			formData,
		);
		if (status === 200) {
			imagePreview.value = data.data;
		} else {
			openAlert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
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
		profileImage:
			imagePreview.value === userInfo.userProfile
				? null
				: imagePreview.value[0],
		latitude: latitude.value,
		longitude: longitude.value,
	};
	try {
		const { status } = await sendRequest(
			'patch',
			'/users/information',
			{
				headers: {
					contentType: 'json/application',
					Authorization: `Bearer ${userInfo.accessToken}`,
				},
			},
			formData,
		);
		if (status === 200) {
			userInfo.userNickname = userNickName.value;
			userInfo.userCountry = country.value;
			userInfo.userProfile = imagePreview.value;
			router.back();
		}
	} catch (error) {
		console.log(error);
	}
};

const alertValue = ref(false);
const alertText = ref('');

const openAlert = content => {
	alertValue.value = true;
	alertText.value = content;
};

const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0,
};

const errorCallback = error => {
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
					position => {
						getCountry(position.coords.latitude, position.coords.longitude);
						useLocationStore().setLocation(
							position.coords.latitude,
							position.coords.longitude,
						);
						isLoading.value = false;
					},
					errorCallback,
					options,
				);
			} else if (permissionResult.state === 'prompt') {
				const position = await new Promise((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject, options);
				});
				getCountry(position.coords.latitude, position.coords.longitude);
				isLoading.value = false;
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
				isLoading.value = false;
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
		isLoading.value = false;
	}
};

const setCountryCoordinates = async (lat, long) => {
	latitude.value = lat;
	longitude.value = long;
};

const getCountry = async (latitude, longitude) => {
	setCountryCoordinates(latitude, longitude);
	try {
		const { status, data } = await sendRequest(
			'get',
			`/locations?latitude=${latitude}&longitude=${longitude}`,
			{
				headers: {
					contentType: 'multipart/form-data',
				},
			},
			null,
		);
		if (status === 200) {
			country.value = data.data.country;
		} else {
			openAlert(
				'지역정보를 가져오는데 실패했습니다. 위치권한 설정을 확인해주세요.',
			);
		}
	} catch (error) {
		console.log(error);
	}
};

onMounted(() => {
	userNickName.value = userInfo.userNickname;
	country.value = userInfo.userCountry;
	imagePreview.value = userInfo.userProfile;
});
</script>
