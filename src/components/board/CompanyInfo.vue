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
						<RegistWrap :fields="fields" :formFields.sync="formFields" @openSelectForIndustry="openIndustrySelect"
							@openSelectForCountry="openCountrySelect" />
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
	<SelectDialog v-if="selectOpenValue" :title="selectTitle" :list="selectList" @close="closeSelect"
		@select:value="selectedValue" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import RegistWrap from '@/components/board/RegistWrap.vue'; // 새로운 컴포넌트 import
import { useI18n } from 'vue-i18n';
import { countries, industryList } from '@/utils/selectItems';
import { IField, IFormFields, ISelectItem } from '@/types/interface';
import SelectDialog from '../selections/SelectDialog.vue';

const emits = defineEmits(['close']);
const { t } = useI18n();

const companyNameValue = ref('');
const industryValue = ref('');
const industryCode = ref('');
const companyPhoneValue = ref('');
const companyEmailValue = ref('');
const companyHomepageValue = ref('');
const companyAddressValue = ref('');
const countryValue = ref('');
const countryCodeValue = ref('');
const regionValue = ref('');

const imagePreview = ref('');

const fields: IField[] = [
	{ name: 'region', model: regionValue, label: 'Region', translationKey: 'companyInfoView.region' },
	{ name: 'country', model: countryValue, label: 'Country', translationKey: 'companyInfoView.country' },
	{ name: 'companyAddress', model: companyAddressValue, label: 'CompanyAddress', translationKey: 'companyInfoView.companyAddress' },
	{ name: 'companyHomepage', model: companyHomepageValue, label: 'CompanyHomepage', translationKey: 'companyInfoView.companyHomepage' },
	{ name: 'companyEmail', model: companyEmailValue, label: 'CompanyEmail', translationKey: 'companyInfoView.companyEmail' },
	{ name: 'companyPhone', model: companyPhoneValue, label: 'CompanyPhone', translationKey: 'companyInfoView.companyPhone' },
	{ name: 'industry', model: industryValue, label: 'Industry', translationKey: 'companyInfoView.industry' },
	{ name: 'companyName', model: companyNameValue, label: 'Company', translationKey: 'companyInfoView.company' },
];

const formFields = ref<IFormFields>({
	isActive: {
		companyName: true,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
		region: false,
	},
	visibleFields: {
		companyName: true,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
		region: false,
	},
	labelFields: {
		companyName: false,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
		region: false,
	},
	verification: {
		companyName: true,
		industry: false,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: false,
		region: false,
	},
	select: {
		companyName: false,
		industry: true,
		companyPhone: false,
		companyEmail: false,
		companyHomepage: false,
		companyAddress: false,
		country: true,
		region: false,
	},
});


const selectOpenValue = ref(false);

const selectTitle = ref(t('postModal.selectCategory'));
const selectList = ref<ISelectItem[]>(industryList);
const selectedCategory = ref({ name: t('postModal.communication'), code: 'COMMUNICATION' });
const selectedValue = (value: ISelectItem) => {
	if (selectTitle.value === '경력 선택') {
		industryValue.value = t(value.name);
		industryCode.value = value.code;
	} else if (selectTitle.value === '국가 선택') {
		countryValue.value = t(value.name);
		countryCodeValue.value = value.code;
	}
};

const closeSelect = () => {
	selectOpenValue.value = false;
};

const openIndustrySelect = () => {
	selectTitle.value = '경력 선택'
	selectList.value = industryList;
	selectOpenValue.value = true;
};

const openCountrySelect = () => {
	selectTitle.value = '국가 선택'
	selectList.value = countries;
	selectOpenValue.value = true;
};

const previewImage = () => {
	// 이미지 미리보기 기능 구현
};

const removeImage = () => {
	// 이미지 삭제 기능 구현
};

const closeModal = () => {
	emits('close');
};

const saveProfile = () => {
	// 프로필 저장 기능 구현
};


const buttonClass = computed(() => {
	return {
		'button--primary': companyNameValue.value && industryValue.value && companyPhoneValue.value && companyEmailValue.value && companyHomepageValue.value && companyAddressValue.value && countryValue.value && regionValue.value,
		'button--disabled': !companyNameValue.value || !industryValue.value || !companyPhoneValue.value || !companyEmailValue.value || !companyHomepageValue.value || !companyAddressValue.value || !countryValue.value || !regionValue.value,
	};
});
</script>
