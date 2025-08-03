<template>
	<!-- postdialog -->
	<div class="modal modal--full post--dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">
					{{ isJobBoard ? t('postModal.jobPost') : t('postModal.writePost') }}
				</p>
				<button
					type="button"
					class="button-icon__s button--post_upload"
					@click="postUpload"
				>
					<svg viewBox="0 0 16 16">
						<path :d="postRegistrationIcon.first" />
						<path :d="postRegistrationIcon.second" />
					</svg>
					<span>{{ t('postModal.register') }}</span>
				</button>
				<button class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="post-wrap">
					<!-- 일반게시판 -->
					<!-- 카테고리 선택 -->
					<div class="fnc-wrap" v-if="!isJobBoard">
						<div class="category__list">
							<button
								type="button"
								class="button--select"
								@click="openCategorySelect"
							>
								<span>{{ selectedCategory.name }}</span>
							</button>
						</div>
					</div>
					<!-- 공개 권한 선택 -->
					<div class="input-wrap" v-if="!isJobBoard">
						<div class="input__wrap radio-type">
							<div class="input__item">
								<input
									v-model="privateYn"
									type="radio"
									class="input__radio"
									id="allCountries"
									name="postSelect"
									value="N"
									checked
								/>
								<label for="allCountries" class="input__label">{{
									t('postModal.public')
								}}</label>
							</div>
							<div class="input__item">
								<input
									v-model="privateYn"
									type="radio"
									class="input__radio"
									id="onlyMyCountry"
									name="postSelect"
									value="Y"
									@click="openAlert(t('postModal.privateDescription'))"
								/>
								<label for="onlyMyCountry" class="input__label">{{
									t('postModal.private')
								}}</label>
							</div>
						</div>
					</div>
					<!-- //일반게시판 -->
					<!-- 구인구직 -->
					<!-- 채용마감일 -->
					<div class="input-wrap" v-if="isJobBoard">
						<em class="input__title">{{ t('postModal.deadLine') }}</em>
						<div class="input__wrap underline-type date-type">
							<div class="input__item _date" :class="{ disabled: allDate }">
								<div class="input__item_inner">
									<label
										for="selectedDate"
										v-if="!selectedDate"
										class="placeholder"
										>{{ PlaceholderDate }}</label
									>
									<input
										type="date"
										class="input__element"
										id="selectedDate"
										:min="minDate"
										v-model="selectedDate"
										@input="updateDate"
										:disabled="allDate"
									/>
								</div>
							</div>
							<div class="input__item">
								<input
									type="checkbox"
									class="input__checkbox _text"
									id="allDate"
									v-model="allDate"
									@change="updatePlaceholderDate"
								/>
								<label for="allDate" class="input__label">{{
									t('postModal.jobOpeningsFrequently')
								}}</label>
							</div>
						</div>
					</div>
					<!-- 경력 선택 -->
					<div class="input-wrap" v-if="isJobBoard">
						<em class="input__title">{{ t('postModal.experience') }}</em>
						<div class="input__wrap underline-type date-type">
							<div class="input__item _date" :class="{ disabled: allCareer }">
								<div class="input__item_inner">
									<label
										for="selCareer"
										v-if="!selectedCareer"
										class="placeholder"
										>{{ PlaceholderCareer }}</label
									>
									<input
										type="text"
										class="input__element"
										id="selCareer"
										v-model="selectedCareer"
										:disabled="allCareer"
										@click="onSelectModal()"
										readonly
									/>
								</div>
							</div>
							<div class="input__item">
								<input
									type="checkbox"
									class="input__checkbox _text"
									id="allCareer"
									v-model="allCareer"
									@change="updatePlaceholderCareer"
								/>
								<label for="allCareer" class="input__label">{{
									t('postModal.noExperience')
								}}</label>
							</div>
						</div>
					</div>
					<!-- //구인구직 -->

					<!-- post -->
					<div class="post__wrap">
						<!-- title -->
						<div class="post__title">
							<div class="input__wrap underline-type">
								<div class="input__item">
									<div class="input__item_inner">
										<input
											v-model="title"
											type="text"
											class="input__element"
											:placeholder="t('postModal.titlePlaceHolder')"
											autocomplete="off"
										/>
									</div>
								</div>
							</div>
						</div>
						<!-- contents -->
						<div class="post__content">
							<div class="post">
								<textarea
									v-model="content"
									class="text__area"
									name="content"
									autocomplete="off"
									:placeholder="t('postModal.contentPlaceHolder')"
									data-autosuggest_is-input="true"
									ref="adjustTextarea"
									@input="adjustTextareaHeight"
									rows="3"
								></textarea>
								<!-- 총 글자수 -->
								<p class="write__count">
									<i class="blind">현재 입력한 글자수</i>
									<em class="count__num">{{ currentCharCount }}</em>
									<i>/</i>
									<i class="blind">전체 입력 가능한 글자수</i>
									<span class="count__total">{{ maxCharCount }}</span>
								</p>
								<!-- file preview -->
								<div class="attachments__wrap" v-if="isImageUploaded">
									<div
										class="attachments__item"
										v-for="(image, index) in imagePreview"
										:key="index"
									>
										<div class="item__display">
											<img :src="image" alt="preview" />
											<button
												type="button"
												class="button--del"
												@click="removeImage(index)"
											>
												<i class="blind">삭제</i>
											</button>
										</div>
									</div>
								</div>
								<!-- hashtag -->
								<div class="tag__wrap" v-if="hashTagArea">
									<div class="tag__inner">
										<div class="input-wrap">
											<div class="input__wrap underline-type">
												<div class="input__item">
													<div class="input__item_inner">
														<input
															v-model="hashTag"
															type="text"
															class="input__element"
															:placeholder="t('postModal.enterHashtag')"
															autocomplete="off"
														/>
													</div>
												</div>
												<button
													type="button"
													class="button button--primary"
													@click="addTag"
												>
													<span>{{ t('postModal.register') }}</span>
												</button>
											</div>
										</div>
										<div class="tag__item">
											<span class="item--hash" v-for="tag in tags" :key="tag">
												<em>{{ tag }}</em>
												<button
													type="button"
													class="input__button-remove"
													title="텍스트삭제"
													@click="removeTag(tag)"
												></button>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--  -->
					<div class="util__wrap">
						<!-- 사진추가 -->
						<div class="item__fnc">
							<div class="input__wrap input__attachments">
								<div class="input__file">
									<input
										type="file"
										id="file-upload"
										multiple
										accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff"
										@change="previewImage"
									/>
									<label for="file-upload" class="button-icon__s" role="button">
										<svg viewBox="0 0 16 16">
											<path :d="imageSelectIcon.first" />
											<path :d="imageSelectIcon.second" />
										</svg>
										<i class="blind">사진 선택</i>
									</label>
								</div>
							</div>
						</div>
						<!-- 해시태그 -->
						<div class="item__fnc">
							<button
								type="button"
								class="button-icon__s"
								@click="hashTagAreaOpen"
							>
								<svg viewBox="0 0 16 16">
									<path :d="hashTagIcon" />
								</svg>
								<i class="blind">해시태그 추가</i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<CustomAlert
		v-if="alertValue"
		:alertValue="alertValue"
		:alertText="alertText"
		@update:alertValue="closeAlert"
	/>
	<SelectDialog
		v-if="selectDialogValue"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
	<LoadingModal v-if="isLoading" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { resizeImage } from '@/shared/utils/image';
import { experienceList } from '@/shared/utils/selectItems';
import {
	uploadJobBoardApi,
	uploadPostApi,
} from '@/features/board/services/post';
import type { ISelectItem } from '@/shared/types/common';
import type { IApiImage } from '@/shared/types/common';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import {
	postRegistrationIcon,
	imageSelectIcon,
	hashTagIcon,
} from '@/shared/utils/icons';
import { AxiosResponse } from 'axios';
import { useI18n } from 'vue-i18n';
import SelectDialog from '@/shared/components/ui/SelectDialog.vue';
import CustomAlert from '@/shared/components/ui/CustomAlert.vue';
import LoadingModal from '@/shared/components/ui/LoadingModal.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const selectList = ref<ISelectItem[]>();
const userInfo = useUserInfoStore();
const selectedDate = ref('');
const selectedCareer = ref('');
const selectedCareerCode = ref('');
const allDate = ref(false);
const allCareer = ref(false);
const updateDate = (event: Event) => {
	const inputElement = event.target as HTMLInputElement;
	selectedDate.value = inputElement.value;
};
const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const minDate = `${year}-${month}-${day}`;

const PlaceholderDate = ref('날짜 선택');
const updatePlaceholderDate = () => {
	if (allDate.value) {
		selectedDate.value = '';
		PlaceholderDate.value = t('postModal.jobOpeningsFrequently');
	} else {
		PlaceholderDate.value = t('postModal.selectDate');
	}
};
const PlaceholderCareer = ref(t('postModal.selectExperience'));
const updatePlaceholderCareer = () => {
	if (allCareer.value) {
		selectedCareer.value = '';
		PlaceholderCareer.value = t('postModal.noExperience');
	} else {
		PlaceholderCareer.value = t('postModal.selectExperience');
	}
};
watch(allDate, () => {
	updatePlaceholderDate();
});
watch(allCareer, () => {
	updatePlaceholderCareer();
});

const router = useRouter();
const selectDialogValue = ref(false);
const selectTitle = ref(t('postModal.selectCategory'));
const selectedCategory = ref({
	name: t('postModal.communication'),
	code: 'COMMUNICATION',
});
const selectedValue = (value: ISelectItem) => {
	if (selectTitle.value === '경력 선택') {
		selectedCareer.value = t(value.name);
		selectedCareerCode.value = value.code;
	}
	selectedCategory.value = value;
};

const openCategorySelect = () => {
	selectDialogValue.value = true;
};
const closeSelect = () => {
	selectDialogValue.value = false;
};

const alertValue = ref(false);
const alertText = ref('');
const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
};
const closeAlert = () => {
	alertValue.value = false;
};

// radio value
const privateYn = ref('N');

// title value
const title = ref('');

// content 변수 및 watch
const content = ref('');
const adjustTextarea = ref(null);
const currentCharCount = ref(0);
const maxCharCount = 500;
const adjustTextareaHeight = () => {
	const textarea = adjustTextarea.value as unknown as HTMLTextAreaElement;
	if (textarea) {
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}
	currentCharCount.value = content.value.length;
	if (currentCharCount.value > maxCharCount) {
		content.value = content.value.slice(0, maxCharCount);
	}
};
watch(content, () => {
	adjustTextareaHeight();
});

// 이미지 관련 변수
const isImageUploaded = computed(() => imagePreview.value.length > 0);
const imageFile = ref<File[]>([]);
const imagePreview = ref<string[]>([]);
const imagePaths = ref<string[]>([]);

const props = defineProps<{
	isJobBoard: boolean;
}>();

// 프리뷰 이미지 처리 함수 - 수정: 모든 파일을 반복 처리
const previewImage = (event: Event) => {
	const input = event.target as HTMLInputElement;
	if (!input.files || input.files.length === 0) {
		openAlert(t('postModal.fileHasntBeenUploaded'));
		return;
	}
	for (let i = 0; i < input.files.length; i++) {
		if (imagePreview.value.length >= 3) {
			openAlert(t('postModal.imageUpTo3'));
			break;
		}
		const file = input.files[i];
		imageFile.value.push(file);
		const reader = new FileReader();
		reader.onload = (e: ProgressEvent<FileReader>) => {
			const result = e.target?.result;
			if (typeof result === 'string') {
				imagePreview.value.push(result);
			}
		};
		reader.readAsDataURL(file);
	}
};

// 미리보기 삭제
const removeImage = (index: number) => {
	imagePreview.value.splice(index, 1);
	imageFile.value.splice(index, 1);
};

const emit = defineEmits(['onPostModal:value']);
const closeModal = () => {
	emit('onPostModal:value', false);
};

// tags 변수
const hashTag = ref('');
const tags = ref<string[]>([]);
const removeSpecialCharacters = (str: string) => {
	const regex = /[^\wㄱ-ㅎㅏ-ㅣ가-힣]/gi;
	return str.replace(regex, '');
};
const addTag = () => {
	if (tags.value.length > 7) {
		openAlert(t('postModal.tageUpTo8'));
		return;
	}
	const sanitizedTag = removeSpecialCharacters(hashTag.value);
	tags.value.push(sanitizedTag);
	hashTag.value = '';
};
const removeTag = (tag: string) => {
	tags.value.splice(tags.value.indexOf(tag), 1);
};

const hashTagArea = ref(false);
const hashTagAreaOpen = () => {
	hashTagArea.value = true;
};

// 이미지 업로드 함수
const imageUpload = async () => {
	if (imageFile.value.length === 0) {
		openAlert(t('postModal.uploadImage'));
		return;
	}
	try {
		const formData = new FormData();
		for (const file of imageFile.value) {
			const resizedImage = await resizeImage(file, 0.5);
			formData.append(
				'multipartFile',
				new File([resizedImage], file.name, { type: file.type }),
			);
		}
		formData.append('imagePath', 'content');
		formData.append('imageType', 'POST');
		const response: AxiosResponse<IApiImage> = await api.post(
			'/api/v1/images',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${userInfo.accessToken ? userInfo.accessToken.toString() : ''}`,
				},
			},
		);
		if (response.status === 200) {
			response.data.data.forEach(image => {
				imagePaths.value.push(image);
			});
		} else {
			openAlert(t('postModal.failedToUploadImage'));
			return;
		}
	} catch (error) {
		console.error(error);
	}
};

// 게시물 업로드 함수
const postUpload = async () => {
	checkIfTokenExists();
	if (!validateUploadPost()) {
		return;
	}
	onLoading();
	if (imageFile.value.length > 0) {
		try {
			await imageUpload();
		} catch (error) {
			console.error(error);
			offLoading();
		}
	}
	try {
		const form = props.isJobBoard ? createJobBoardForm() : createPostForm();
		const { status } = props.isJobBoard
			? await uploadJobBoardApi(form)
			: await uploadPostApi(userInfo.userId, form);
		if (status === 201 || status === 200) {
			setTimeout(() => {
				offLoading();
				openAlert(t('postModal.postingSucceed'));
				closeModal();
			}, 1000);
		}
	} catch (error) {
		console.error(error);
		offLoading();
	}
};

// 로딩 변수 및 on/off 함수
const isLoading = ref(false);
const onLoading = () => {
	isLoading.value = true;
};
const offLoading = () => {
	isLoading.value = false;
};

// 토큰 존재여부 체크 함수
const checkIfTokenExists = () => {
	if (!localStorage.getItem('accessToken')) {
		router.push('/sign-in');
	}
};

// 이미지 업로드 요청 폼 생성 함수
const createPostForm = () => {
	return {
		title: title.value,
		content: content.value,
		tags: tags.value,
		attachments: imagePaths.value,
		isPublic: privateYn.value === 'N',
		category: selectedCategory.value.code,
	};
};
const createJobBoardForm = () => {
	return {
		title: title.value,
		content: content.value,
		tags: tags.value,
		attachments: imagePaths.value,
		isPublic: privateYn.value === 'N',
		deadline: allDate.value ? null : selectedDate.value + 'T00:00:00',
		experience: allCareer.value ? null : selectedCareerCode.value,
	};
};
const validateUploadPost = () => {
	if (!title.value) {
		openAlert(t('postModal.enterTitle'));
		return false;
	}
	if (!content.value) {
		openAlert(t('postModal.enterContent'));
		return false;
	}
	if (props.isJobBoard && !selectedDate.value && !allDate.value) {
		openAlert(t('postModal.selectDate'));
		return false;
	}
	return true;
};
const onSelectModal = () => {
	selectDialogValue.value = true;
	selectTitle.value = '경력 선택';
	selectList.value = experienceList;
};
</script>
