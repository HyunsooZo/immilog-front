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
							<div class="input-wrap _regist" v-for="(field, index) in fields" :key="index"
								:class="{ active: formFields.isActive[field.name] }" :style="getStyle(field.name)">
								<div class="input__wrap underline-type">
									<div class="input__item">
										<div class="input__item_inner">
											<input type="text" class="input__element" :v-model="field.model"
												@input="handleInput(field.name, index)" />
											<label :for="`regist${field.label}`" :class="{ active: formFields.labelFields[field.name] }">
												{{ t(field.translationKey) }}
											</label>
										</div>
									</div>
								</div>
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

const fields = [
	{ name: 'country', model: countryValue, label: 'Country', translationKey: 'companyInfoView.country' },
	{ name: 'companyAddress', model: companyAddressValue, label: 'CompanyAddress', translationKey: 'companyInfoView.companyAddress' },
	{ name: 'companyHomepage', model: companyHomepageValue, label: 'CompanyHomepage', translationKey: 'companyInfoView.companyHomepage' },
	{ name: 'companyEmail', model: companyEmailValue, label: 'CompanyEmail', translationKey: 'companyInfoView.companyEmail' },
	{ name: 'companyPhone', model: companyPhoneValue, label: 'CompanyPhone', translationKey: 'companyInfoView.companyPhone' },
	{ name: 'industry', model: industryValue, label: 'Industry', translationKey: 'companyInfoView.industry' },
	{ name: 'companyName', model: companyNameValue, label: 'Company', translationKey: 'companyInfoView.company' },
];

const formFields = ref({
	isActive: {
		companyName: true,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
	},
	visibleFields: {
		companyName: true,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
	},
	labelFields: {
		companyName: false,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
	},
});

const isVisible = (field: string) => formFields.value.visibleFields[field];
const getStyle = (field: string) => {
	return isVisible(field) ? 'display: block;' : 'display: none;';
};
const handleInput = (field: string, index: number) => {
	formFields.value.labelFields[field] = true;
	if (index < fields.length && index >= 0) {
		const nextField = fields[index - 1].name;
		formFields.value.visibleFields[nextField] = true;
		setTimeout(() => {
			formFields.value.isActive[field] = true;
			formFields.value.isActive[nextField] = true;
		}, 1000);
	}
};

const closeModal = () => {
	emits('close');
};
</script>
