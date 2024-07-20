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
							<!-- country -->
							<div class="input-wrap _regist" :class="{ active: isActive.companyAddress }"
								:style="getStyle('companyAddress')">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" v-model="countryValue"
												@input="handleInput('country')" />
											<label for="registCountry" :class="{ active: labelFields.country }">{{
												t('companyInfoView.country')
												}}</label>
										</div>
									</div>
								</div>
							</div>
							<!-- companyAddress -->
							<div class="input-wrap _regist" :class="{ active: isActive.companyHomepage }"
								:style="getStyle('companyHomepage')">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" v-model="companyAddressValue"
												@input="handleInput('companyAddress')" />
											<label for="registCompanyAddress" :class="{ active: labelFields.companyAddress }">{{
												t('companyInfoView.companyAddress') }}</label>
										</div>
									</div>
								</div>
							</div>
							<!-- companyHomepage -->
							<div class="input-wrap _regist" :class="{ active: isActive.companyEmail }"
								:style="getStyle('companyEmail')">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" v-model="companyHomepageValue"
												@input="handleInput('companyHomepage')" />
											<label for="registCompanyHomepage" :class="{ active: labelFields.companyHomepage }">{{
												t('companyInfoView.companyHomepage') }}</label>
										</div>
									</div>
								</div>
							</div>
							<!-- companyEmail -->
							<div class="input-wrap _regist" :class="{ active: isActive.companyPhone }"
								:style="getStyle('companyPhone')">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" v-model="companyEmailValue"
												@input="handleInput('companyEmail')" />
											<label for="registCompanyEmail" :class="{ active: labelFields.companyEmail }">{{
												t('companyInfoView.companyEmail') }}</label>
										</div>
									</div>
								</div>
							</div>
							<!-- companyPhone -->
							<div class="input-wrap _regist" :class="{ active: isActive.industry }" :style="getStyle('industry')">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" v-model="companyPhoneValue"
												@input="handleInput('companyPhone')" />
											<label for="registCompanyPhone" :class="{ active: labelFields.companyPhone }">{{
												t('companyInfoView.companyPhone') }}</label>
										</div>
									</div>
								</div>
							</div>
							<!-- industry -->
							<div class="input-wrap _regist" :class="{ active: isActive.companyName }"
								:style="getStyle('companyName')">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" v-model="industryValue"
												@input="handleInput('industry')" />
											<label for="registIndustry" :class="{ active: labelFields.industry }">{{
												t('companyInfoView.industry')
												}}</label>
										</div>
									</div>
								</div>
							</div>
							<!-- companyName -->
							<div class="input-wrap _regist active">
								<div class=" input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" id="registCompany" class="input__element" v-model="companyNameValue"
												@input="handleInput('companyName')" />
											<label for="registCompanyName" :class="{ active: labelFields.companyName }">{{
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
import { ref } from 'vue';
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

const isActive = ref({
	companyName: false,
	industry: false,
	companyPhone: false,
	companyEmail: false,
	companyHomepage: false,
	companyAddress: false,
	country: false,
});
const visibleFields = ref({
	companyName: false,
	industry: false,
	companyPhone: false,
	companyEmail: false,
	companyHomepage: false,
	companyAddress: false,
	country: false,
});
const labelFields = ref({
	companyName: false,
	industry: false,
	companyPhone: false,
	companyEmail: false,
	companyHomepage: false,
	companyAddress: false,
	country: false,
});

const isVisible = (field: string) => visibleFields.value[field];
const getStyle = (field: string) => {
	return isVisible(field) ? 'display: block;' : 'display: none;';
};
const handleInput = (field: string) => {
	visibleFields.value[field] = true;
	labelFields.value[field] = true;

	setTimeout(() => {
		isActive.value[field] = true;
	}, 1000);
};

const closeModal = () => {
	emits('close');
};

</script>
