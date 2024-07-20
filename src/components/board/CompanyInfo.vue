<template>
	<div class="modal modal--full _fixed-bot">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">{{ t('companyInfoView.companyInfo') }}</p>
				<button type="button" class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="content">
					<TheTopBox :title="t('companyInfoView.companyRegist')" :text="t('companyInfoView.companyRegistText')" />
					<div class="container">
						<!-- userProfileUrl -->
						<div class="input-wrap">
							<div class="input__wrap input__attachments _edit">
								<div class="input__item">
									<div class="input__item_inner">
										<div class="input__file">
											<input type="file" id="file-upload" class="input__element" @change="previewImage" />
											<label for="file-upload" class="button" role="button">
												<span class="blind">회사 로고 선택</span>
											</label>
										</div>
										<div class="item__display" :class="{ 'image--default _company': !imagePreview }">
											<img v-if="imagePreview" :src="imagePreview" alt="Preview" />
											<button type="reset" class="button--del" @click="removeImage">
												<i class="blind">삭제</i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="regist-wrap">
							<div v-for="(field, index) in fields" :key="index" class="input-wrap _regist"
								:class="{ active: isActive[index] }" :style="getStyle(index)">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" :class="`input__element`" v-model="field.value" @input="handleInput(index)" />
											<label :for="`regist${field.name}`" :class="{ active: labelFields[index] }">{{ field.label
												}}</label>
										</div>
									</div>
								</div>
							</div>
							<div class="input-wrap _regist active">
								<div class=" input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" id="registCompany" class="input__element" v-model="companyNameValue"
												@input="handleInput(fields.length - 1)" />
											<label for="registCompanyName" :class="{ active: labelFields[fields.length - 1] }">{{
												t('companyInfoView.company') }}</label>
										</div>
									</div>
									<button type="button" class="button button--primary" @click="checkNickName">{{
										t('companyInfoView.duplicationCheck') }}</button>
								</div>
								<p v-if="nickNameCheckDone && !isNickNameValid && isNickNameChanged" class="input__error"
									aria-live="assertive">{{ t('signUpView.alreadyInUse') }}</p>
								<p v-if="!nickNameCheckDone && !isNickNameValid && isNickNameChanged" class="input__error"
									aria-live="assertive">{{ t('signUpView.doDuplicationCheck') }}</p>
								<p v-if="nickNameCheckDone && isNickNameValid && isNickNameChanged" class="input__text"
									aria-live="assertive">{{ t('signUpView.availableNickname') }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="button-wrap">
					<button class="button" :class="buttonClass" @click="saveProfile">{{ t('companyInfoView.save') }}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['close']);
const { t } = useI18n();

const companyNameValue = ref('');
const industryValue = ref('');
const companyPhoneValue = ref('');
const companyEmailValue = ref('');
const companyHomepageValue = ref('');
const companyAddressValue = ref('');
const countryValue = ref('');

const fields = reactive([
	{ name: 'Country', value: countryValue, label: t('companyInfoView.country') },
	{ name: 'CompanyAddress', value: companyAddressValue, label: t('companyInfoView.companyAddress') },
	{ name: 'CompanyHomepage', value: companyHomepageValue, label: t('companyInfoView.companyHomepage') },
	{ name: 'CompanyEmail', value: companyEmailValue, label: t('companyInfoView.companyEmail') },
	{ name: 'CompanyPhone', value: companyPhoneValue, label: t('companyInfoView.companyPhone') },
	{ name: 'Industry', value: industryValue, label: t('companyInfoView.industry') },
	{ name: 'CompanyName', value: companyNameValue, label: t('companyInfoView.company') },
]);

const isActive = ref(Array(fields.length).fill(false));
const visibleFields = ref(Array(fields.length).fill(false));
const labelFields = ref(Array(fields.length).fill(false));

// 닉네임 체크와 관련된 상태 변수 초기화
const nickNameCheckDone = ref(false);
const isNickNameValid = ref(false);
const isNickNameChanged = ref(false);

// 클래스 관련 상태 변수 초기화
const buttonClass = ref('');

visibleFields.value[0] = true; // 첫 번째 필드가 기본적으로 보이도록 설정

const isVisible = (index: number) => visibleFields.value[index];
const getStyle = (index: number) => {
	return isVisible(index) ? 'display: block;' : 'display: none;';
};

const handleInput = (index: number) => {
	console.log(`handleInput called for index: ${index}`);
	console.log(`Current value of field: ${fields[index].value}`);

	if (fields[index].value) {
		if (index > 0) {
			setTimeout(() => {
				if (index === fields.length - 1) {
					labelFields.value[index] = true;
				}
				labelFields.value[index - 1] = true;
				console.log(`labelFields updated: ${JSON.stringify(labelFields.value)}`);
				visibleFields.value[index - 1] = true;
				console.log(`visibleFields updated: ${JSON.stringify(visibleFields.value)}`);
				isActive.value[index - 1] = true;
				console.log(`isActive updated: ${JSON.stringify(isActive.value)}`);
			}, 1000);
		}
	}
};

fields.forEach((field, index) => {
	watch(field.value, (newValue) => {
		console.log(`watch triggered for index: ${index}, newValue: ${newValue}`);
		if (newValue) {
			handleInput(index);
		}
	});
});

const closeModal = () => {
	emits('close');
};

const checkNickName = () => {
	// 닉네임 중복 체크 로직 추가
	isNickNameChanged.value = true;
	// 예시: 중복 체크가 완료되고 유효한 닉네임일 경우
	nickNameCheckDone.value = true;
	isNickNameValid.value = true;
};

const previewImage = (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview.value = e.target.result;
		};
		reader.readAsDataURL(file);
	}
};

const removeImage = () => {
	imagePreview.value = '';
};

const imagePreview = ref('');

</script>
