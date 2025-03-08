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
						<RegistWrap :fields="fields" :formFields.sync="formFields" :isFilled="doesCompanyInfoExist"
							@openSelectForIndustry="openIndustrySelect" @openSelectForCountry="openCountrySelect" />
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="button-wrap">
					<button class="button" :class="{
						'button button--positive': buttonActivationCriteria,
						'button button--disabled': !buttonActivationCriteria,
					}" :disabled="!buttonActivationCriteria" @click="submit">{{ t('companyInfoView.save') }}</button>
				</div>
			</div>
		</div>
	</div>
	<SelectDialog v-if="selectOpenValue" :title="selectTitle" :list="selectList" @close="closeSelect"
		@select:value="selectedValue" />
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	</teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { countries, industryList } from '@/utils/selectItems';
import { IField, IFormFields, ISelectItem } from '@/types/interface';
import { postCompanyInfo, getMyCompanyInfo } from '@/services/companyService';
import { AxiosResponse } from 'axios';
import { IApiCompanyInfo, IApiImage } from '@/types/api-interface';
import { multipartFormData } from '@/utils/header';
import { resizeImage } from '@/utils/image';
import { useCompanyInfo } from '@/stores/company';
import SelectDialog from '../selections/SelectDialog.vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import RegistWrap from '@/components/board/RegistWrap.vue';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import api from '@/api';

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
const countryCode = ref('');
const regionValue = ref('');

const imagePreview = ref();
const imageUrl = ref();
const imageFile = ref(null);
const imageHasChanged = ref(false);

const companyInfo = useCompanyInfo();

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

const selectOpenValue = ref(false);

const selectTitle = ref(t('postModal.selectCategory'));
const selectList = ref<ISelectItem[]>(industryList);
const selectedValue = (value: ISelectItem) => {
	if (selectTitle.value === t('companyInfoView.industry')) {
		industryValue.value = t(value.name);
		industryCode.value = value.code;
	} else if (selectTitle.value === t('companyInfoView.country')) {
		countryValue.value = t(value.name);
		countryCode.value = value.code;
	}
};

const closeSelect = () => {
	selectOpenValue.value = false;
};

const openIndustrySelect = () => {
	selectTitle.value = t('companyInfoView.industry');
	selectList.value = industryList;
	selectOpenValue.value = true;
};

const openCountrySelect = () => {
	selectTitle.value = t('companyInfoView.country');
	selectList.value = countries;
	selectOpenValue.value = true;
};
// 프리뷰이미지 삭제
const removeImage = () => {
	// 비어있는 이미지로 설정
	imagePreview.value = '';
	imageFile.value = null;
	imageUrl.value = [''];
	imageHasChanged.value = true;
};

const closeModal = () => {
	emits('close');
};

const buttonActivationCriteria = computed(() => {
	if (doesCompanyInfoExist) {
		return companyInfo.companyNameValue != companyNameValue.value ||
			companyInfo.industryValue != industryValue.value ||
			companyInfo.companyPhoneValue != companyPhoneValue.value ||
			companyInfo.companyEmailValue != companyEmailValue.value ||
			companyInfo.companyHomepageValue != companyHomepageValue.value ||
			companyInfo.companyAddressValue != companyAddressValue.value ||
			companyInfo.countryValue != countryValue.value ||
			companyInfo.regionValue != regionValue.value ||
			imageHasChanged.value;
	}
	return companyNameValue.value &&
		industryValue.value &&
		companyPhoneValue.value &&
		companyEmailValue.value &&
		companyHomepageValue.value &&
		companyAddressValue.value &&
		countryValue.value &&
		regionValue.value;
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
			imageHasChanged.value = true;
		};
		reader.readAsDataURL(input.files[0]);
	}
}

// <-- 회사 정보 등록 관련
const postImageApi = async () => {
	if (!imagePreview.value || !imageFile.value) {
		return;
	}
	try {
		const formData = new FormData();
		const resizedImage = await resizeImage(imageFile.value, 0.5);
		formData.append('multipartFile', resizedImage as Blob);
		const response: AxiosResponse<IApiImage> = await api.post(
			'/images?imagePath=company',
			formData,
			multipartFormData,
		);
		if (response.status === 200) {
			imageUrl.value = response.data.data[0];
		} else {
			openAlert(t('profileEditView.failedToUploadImage'));
		}
	} catch (error) {
		console.log(error);
	}
};

const postCompanyApi = async () => {
	const requestForm = generateRequesrForm();
	try {
		const response = await postCompanyInfo(requestForm);
		const { status } = response;
		if (status === 201 || status === 200) {
			setTimeout(() => {
				closeModal();
			}, 1000);
		}

	} catch (e) {
		console.log(e);
	}
}

const submit = async () => {
	if (imageFile.value) {
		await postImageApi();
	}
	await postCompanyApi();
}
// -->

const generateRequesrForm = () => {
	return {
		industry: industryCode.value,
		companyName: companyNameValue.value,
		companyEmail: companyEmailValue.value,
		companyPhone: companyPhoneValue.value,
		companyAddress: companyAddressValue.value,
		companyHomepage: companyHomepageValue.value,
		companyCountry: countryCode.value,
		companyRegion: regionValue.value,
		companyLogo: imageUrl.value[0],
	}
}
const doesCompanyInfoExist = ref(false);

const fetchUserCompanyInfo = async () => {
	const response: AxiosResponse<IApiCompanyInfo> | any = await getMyCompanyInfo();
	if (response.status === 200 || response.status === 201) {
		const { data } = response.data;
		doesCompanyInfoExist.value = true;
		if (data) {
			companyInfo.setCompanyInfo(data);
			companyNameValue.value = data.company;
			industryValue.value = data.industry;
			companyPhoneValue.value = data.companyPhone;
			companyEmailValue.value = data.companyEmail;
			companyHomepageValue.value = data.companyHomepage;
			companyAddressValue.value = data.companyAddress;
			countryValue.value = t('countries.' + data.companyCountry);
			regionValue.value = data.companyRegion;
			countryCode.value = data.companyCountryCode;
			industryCode.value = data.companyIndustryCode;
			imagePreview.value = data.companyLogo;
		}
	}
}

onMounted(async () => {
	try {
		await fetchUserCompanyInfo();
	} catch (e) {
		console.log(e);
	}
});
</script>
