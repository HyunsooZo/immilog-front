<template>
	<div class="content">
		<TheTopBox :title="'회원가입'" :text="'정보를 입력한 후 회원가입 버튼을 눌러주세요.'" />
		<!-- 회원가입 -->
		<div class="container">
			<!-- e-mail -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">이메일</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type email-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="emailRegister" type="text" class="input__element" placeholder="이메일 입력" required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !isValidEmail" class="input__error" aria-live="assertive">
					이메일 형식이 올바르지 않습니다.
				</p>
			</div>
			<!-- nickname -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">닉네임</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userNickName" type="text" class="input__element" placeholder="닉네임 입력(5~10자 한글, 영문, 숫자 조합)"
								required />
						</div>
					</div>
					<button type="button" class="button button--primary" @click="checkNickName">
						중복확인
					</button>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="nickNameCheckDone && !isNickNameValid" class="input__error" aria-live="assertive">
					이미 사용중인 닉네임 입니다.
				</p>
				<p v-if="nickNameCheckDone && isNickNameValid" class="input__text" aria-live="assertive">
					사용 가능한 닉네임입니다.
				</p>
			</div>
			<!-- profileimage -->
			<div class="input-wrap" style="display: none;">
				<em class="input__title">프로필 사진</em>
				<!-- input__wrap -->
				<div class="input__wrap input__attachments">
					<div class="input__item">
						<div class="input__item_inner">
							<div class="input__file">
								<input type="file" id="file-upload" class="input__element" @change="previewImage" />
								<label for="file-upload" class="button button--primary" role="button">
									<svg viewBox="0 0 16 16">
										<path :d="profilePicSelectIcon.first" />
										<path fill-rule="evenodd" :d="profilePicSelectIcon.second" />
									</svg>
									<span>프로필 사진 선택</span>
								</label>
							</div>
							<div class="item__display">
								<img v-if="imagePreview" :src="imagePreview" alt="Preview" />
								<button v-if="imagePreview" type="reset" class="button--del" @click="removeImage">
									<i class="blind">삭제</i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								placeholder="비밀번호 입력(8~20자 영문, 숫자, 특수문자 조합)" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element" placeholder="비밀번호 확인"
								required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					비밀번호가 일치하지 않습니다.
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					비밀번호는 영문, 숫자, 특수문자 조합으로 8~20자리로 입력해주세요.
				</p>
			</div>
			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								placeholder="비밀번호 입력(8~20자 영문, 숫자, 특수문자 조합)" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element" placeholder="비밀번호 확인"
								required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					비밀번호가 일치하지 않습니다.
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					비밀번호는 영문, 숫자, 특수문자 조합으로 8~20자리로 입력해주세요.
				</p>
			</div>
			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								placeholder="비밀번호 입력(8~20자 영문, 숫자, 특수문자 조합)" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element" placeholder="비밀번호 확인"
								required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					비밀번호가 일치하지 않습니다.
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					비밀번호는 영문, 숫자, 특수문자 조합으로 8~20자리로 입력해주세요.
				</p>
			</div>
			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								placeholder="비밀번호 입력(8~20자 영문, 숫자, 특수문자 조합)" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element" placeholder="비밀번호 확인"
								required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					비밀번호가 일치하지 않습니다.
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					비밀번호는 영문, 숫자, 특수문자 조합으로 8~20자리로 입력해주세요.
				</p>
			</div>
			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								placeholder="비밀번호 입력(8~20자 영문, 숫자, 특수문자 조합)" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element" placeholder="비밀번호 확인"
								required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					비밀번호가 일치하지 않습니다.
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					비밀번호는 영문, 숫자, 특수문자 조합으로 8~20자리로 입력해주세요.
				</p>
			</div>
			<!-- password -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">비밀번호</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPassword" type="password" class="input__element"
								placeholder="비밀번호 입력(8~20자 영문, 숫자, 특수문자 조합)" required />
						</div>
					</div>
				</div>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="userPasswordConfirm" type="password" class="input__element" placeholder="비밀번호 확인"
								required />
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p v-if="submitted && !passwordMatch" class="input__error" aria-live="assertive">
					비밀번호가 일치하지 않습니다.
				</p>
				<p v-if="submitted && !passwordValidation" class="input__error" aria-live="assertive">
					비밀번호는 영문, 숫자, 특수문자 조합으로 8~20자리로 입력해주세요.
				</p>
			</div>

			<!-- country -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">접속 국가</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input v-model="country" type="text" class="input__element" placeholder="지역" value="지역" disabled />
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

<script setup>
import { computed, ref, watch } from 'vue';
import useAxios from '@/composables/useAxios.js';
import { onMounted } from 'vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import TheFooterButton from '@/components/layouts/TheFooterButton.vue';
import { useLocationStore } from '@/stores/location';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import { useRouter } from 'vue-router';
import { profilePicSelectIcon } from '@/utils/icons';
// import { resizeImage } from '@/utils/image';

const imagePreview = ref('');
const emailRegister = ref('');
const userNickName = ref('');
const userPassword = ref('');
const userPasswordConfirm = ref('');
const submitted = ref(false);
const country = ref('국가정보없음');
const region = ref('');
// const imageUrl = ref('');
// const imageFile = ref(null);
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

// 프리뷰 이미지
// const previewImage = event => {
// 	const input = event.target;
// 	if (input.files && input.files[0]) {
// 		const reader = new FileReader();
// 		reader.onload = e => {
// 			imagePreview.value = e.target.result;
// 			imageFile.value = input.files[0];
// 		};
// 		reader.readAsDataURL(input.files[0]);
// 	}
// };

// // 미리보기 삭제
// const removeImage = () => {
// 	// 비어있는 이미지로 설정
// 	imagePreview.value = '';
// 	// input 엘리먼트의 값을 비워줌
// 	const input = document.getElementById('file-upload');
// 	if (input) {
// 		input.value = '';
// 	}
// };

//입력값 검증
const fullFilled = computed(() => {
	return (
		emailRegister.value.trim() !== '' &&
		userNickName.value.trim() !== '' &&
		userPassword.value.trim() !== '' &&
		userPasswordConfirm.value.trim() !== ''
	);
});

// const hostImage = async () => {
// 	if (!imagePreview.value) {
// 		return;
// 	}
// 	try {
// 		const formData = new FormData();
// 		const resizedImage = await resizeImage(imageFile.value, 0.5);
// 		formData.append('multipartFile', resizedImage);
// 		const { status, data } = await sendRequest(
// 			'post',
// 			'/images?imagePath=profile',
// 			{
// 				headers: {
// 					contentType: 'multipart/form-data',
// 				},
// 			},
// 			formData,
// 		);
// 		if (status === 200) {
// 			imageUrl.value = data.data;
// 		} else {
// 			openAlert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// watch(imagePreview, () => {
// 	hostImage();
// });

const register = async () => {
	submitted.value = true;
	passwordValidationCheck();
	passwordConfirmMatch();
	if (!passwordMatch.value || !passwordValidation.value) {
		return;
	}
	if (!isNickNameValid.value) {
		openAlert('닉네임 중복체크를 해주세요.');
	}
	if (
		emailRegister.value &&
		userNickName.value &&
		userPassword.value &&
		userPasswordConfirm.value &&
		passwordValidation.value &&
		passwordMatch.value &&
		isNickNameValid.value
	) {
		try {
			isLoading.value = true;
			const formData = {
				email: emailRegister.value,
				nickName: userNickName.value,
				password: userPassword.value,
				country: country.value,
				region: region.value,
				profileImage: imageUrl.value,
			};
			const { status, data } = await sendRequest(
				'post',
				'/users',
				{
					headers: {
						contentType: 'multipart/form-data',
					},
				},
				formData,
			);

			if (status === 201) {
				console.log(data.data);
				console.dir(data.data);
				onResult();
			} else {
				openAlert(data.message);
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
						getCountry(position.coords.latitude, position.coords.longitude);
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
				getCountry(position.coords.latitude, position.coords.longitude);
			} else if (permissionResult.state === 'denied') {
				console.error('Geolocation permission denied.');
			}
		}
	} catch (error) {
		console.error('Failed to get location:', error);
	}
};

const getCountry = async (latitude, longitude) => {
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
			region.value = data.data.region;
		} else {
			openAlert(
				'지역정보를 가져오는데 실패했습니다. 위치권한 설정을 확인해주세요.',
			);
		}
	} catch (error) {
		console.log(error);
	}
};

const checkNickName = async () => {
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

const openAlert = content => {
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
			titleEmphasis: '회원가입 인증 이메일을 전송했습니다.',
			content:
				'입력하신 이메일을 통하여 <br>이메일 인증을 완료하신 후 <br>아래 버튼을 눌러 로그인을 진행해주세요.',
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
