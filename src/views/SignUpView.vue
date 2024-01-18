<template>
	<div class="content">
		<TheTopBox
			:title="'회원가입'"
			:text="'정보를 입력한 후 회원가입 버튼을 눌러주세요.'"
		/>
		<!-- 회원가입 -->
		<div class="container">
			<!-- e-mail -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">이메일</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type email-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="emailRegister"
								type="text"
								class="input__element"
								placeholder="이메일 아이디"
								required
							/>
						</div>
					</div>
					<!-- <div class="input__item">
						<div class="input__item_inner">
							<select
								v-if="!hideOptions"
								v-model="emailDomain"
								id="emailSelect"
								class="select__item"
								@change="mailSelect"
								required
							>
								<option value="0">도메인선택</option>
								<option value="1">google.com</option>
								<option value="2">naver.com</option>
								<option value="99">직접입력</option>
							</select>
							<input
								v-if="hideOptions"
								v-model="customDomain"
								type="text"
								id="emailInput"
								class="input__element"
								placeholder="이메일 도메인"
							/>
						</div>
					</div> -->
				</div>
				<!-- 에러 메시지 -->
				<p
					v-if="submitted && !emailRegister"
					class="input__error"
					aria-live="assertive"
				>
					이메일을 입력해 주세요.
				</p>
			</div>

			<!-- nickname -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">닉네임</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="userNickName"
								type="text"
								class="input__element"
								placeholder="사용자 이름 영문/숫자 4자리 이상"
								required
							/>
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p
					v-if="submitted && !userNickName"
					class="input__error"
					aria-live="assertive"
				>
					사용자 이름을 입력해 주세요.
				</p>
			</div>

			<!-- profileimage -->
			<div class="input-wrap">
				<em class="input__title">프로필 사진</em>
				<!-- input__wrap -->
				<div class="input__wrap filepreview-type">
					<div class="input__item">
						<div class="input__item_inner">
							<div class="input__file">
								<input
									type="file"
									id="file-upload"
									class="input__element"
									@change="previewImage"
								/>
								<label
									for="file-upload"
									class="button button--primary"
									role="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										fill="currentColor"
										class="bi bi-person-plus"
										viewBox="0 0 16 16"
									>
										<path
											d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
										/>
										<path
											fill-rule="evenodd"
											d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
										/>
									</svg>
									<span>프로필 사진 선택</span>
								</label>
							</div>
							<div class="file-display">
								<img v-if="imagePreview" :src="imagePreview" alt="Preview" />
								<button
									v-if="imagePreview"
									type="button"
									class="button--del"
									@click="removeImage"
								>
									삭제
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
							<input
								v-model="userPassword"
								type="password"
								class="input__element"
								placeholder="비밀번호 영문/숫자/특수문자 8자리 이상"
								required
							/>
						</div>
					</div>
				</div>
				<!-- 에러 메시지 -->
				<p
					v-if="submitted && !userPassword"
					class="input__error"
					aria-live="assertive"
				>
					비밀번호를 입력해 주세요.
				</p>
			</div>

			<!-- country -->
			<div class="input-wrap" aria-label="required">
				<em class="input__title">지역 확인</em>
				<!-- input__wrap -->
				<div class="input__wrap underline-type">
					<div class="input__item">
						<div class="input__item_inner">
							<input
								v-model="country"
								type="text"
								class="input__element"
								placeholder="지역"
								value="지역"
								disabled
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<TheFooter :onClick="register" :condition="fullFilled" />
	</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import useAxios from '@/composables/useAxios.js';
import { useLocationStore, useCountryStore } from '@/stores/location.js';
import { onMounted } from 'vue';
import TheTopBox from '@/components/TheTopBox.vue';
import TheFooter from '@/components/layouts/TheFooter.vue';

const imagePreview = ref('');
const emailRegister = ref('');
const userNickName = ref('');
const userPassword = ref('');
const submitted = ref(false);
const country = ref(useCountryStore().country);
const { sendRequest } = useAxios();

// 프리뷰 이미지
const previewImage = event => {
	const input = event.target;
	if (input.files && input.files[0]) {
		const reader = new FileReader();
		reader.onload = e => {
			imagePreview.value = e.target.result;
		};
		reader.readAsDataURL(input.files[0]);
	}
};

// 미리보기 삭제
const removeImage = () => {
	// 비어있는 이미지로 설정
	imagePreview.value = '';
	// input 엘리먼트의 값을 비워줌
	const input = document.getElementById('file-upload');
	if (input) {
		input.value = '';
	}
};

//입력값 검증
const fullFilled = computed(() => {
	return (
		emailRegister.value.trim() !== '' &&
		userNickName.value.trim() !== '' &&
		userPassword.value.trim() !== ''
	);
});

const register = async () => {
	submitted.value = true;
	if (emailRegister.value && userNickName.value && userPassword.value) {
		try {
			const formData = {
				email: emailRegister.value,
				nickname: userNickName.value,
				password: userPassword.value,
				country: country.value,
				latitude: 37.5665,
				longitude: 126.978,
			};
			const { status, data } = await sendRequest('post', '/users', formData);

			if (status === 200) {
				console.log(data.data);
				console.dir(data.data);
			}
		} catch (error) {
			console.log(error);
		}
	}
};

onMounted(() => {
	try {
		const formData = {
			latitude: useLocationStore().latitude,
			longitude: useLocationStore().longitude,
		};
		const { status, data } = sendRequest(
			'post',
			`/locations?latitude=${formData.latitude}&longitude=${formData.longitude}`,
		);

		if (status === 200) {
			useCountryStore().setCountry(data.data.country, data.data.region);
			country.value = data.data.country;
		}
	} catch (error) {
		console.log(error);
	}
});
</script>
