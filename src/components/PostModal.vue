<template>
	<!-- postdialog -->
	<div class="modal modal--full post--dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">글쓰기</p>
				<button
					type="button"
					class="button-icon__s button--post_upload"
					@click="postUpload"
				>
					<svg viewBox="0 0 16 16">
						<path
							d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"
						/>
						<path
							d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"
						/>
					</svg>
					<span>등록</span>
				</button>
				<button
					class="button-icon button--close"
					role="link"
					@click="closeModal"
				>
					<span class="blind">취소</span>
				</button>
			</div>
			<div class="modal-body">
				<div class="post-wrap">
					<!-- selectbox -->
					<div class="fnc-wrap">
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
					<div class="input-wrap">
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
								<label for="allCountries" class="input__label"
									>모든 국가에 공개</label
								>
							</div>
							<div class="input__item">
								<input
									v-model="privateYn"
									type="radio"
									class="input__radio"
									id="onlyMyCountry"
									name="postSelect"
									value="Y"
									@click="
										openAlert(
											'내 국가에만 공개 선택 시<br>같은 국가 사용자만 해당 게시물을 볼 수 있습니다.',
										)
									"
								/>
								<label for="onlyMyCountry" class="input__label"
									>내 국가에만 공개</label
								>
							</div>
						</div>
					</div>

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
											placeholder="제목을 입력해주세요."
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
									placeholder="게시글 내용을 입력해주세요. 일정 수 이상의 신고를 받는 경우 글이 자동으로 숨김처리 됩니다."
									data-autosuggest_is-input="true"
									ref="adjustTextarea"
									@input="adjustTextareaHeight"
									rows="3"
								></textarea>
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
												<span class="blind">삭제</span>
											</button>
										</div>
									</div>
									<!-- //loop -->
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
															placeholder="해시태그를 입력 후 등록 버튼을 클릭하세요"
															autocomplete="off"
														/>
													</div>
												</div>
												<button
													type="button"
													class="button button--primary"
													@click="addTag"
												>
													<span>등록</span>
												</button>
											</div>
										</div>
										<!-- tag__item -->
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
										multiple="multiple"
										accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff"
										@change="previewImage"
									/>
									<label for="file-upload" class="button-icon__s" role="button">
										<svg viewBox="0 0 16 16">
											<path
												d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"
											/>
											<path
												d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"
											/>
										</svg>
										<span class="blind">사진 선택</span>
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
									<path
										d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"
									/>
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
		v-if="isCategorySelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import SelectDialog from './SelectDialog.vue';
import CustomAlert from './modal/CustomAlert.vue';
import useAxios from '@/composables/useAxios.js';

const isCategorySelectClicked = ref(false);
const selectTitle = '카테고리 선택';
const selectList = [
	{ name: '워킹홀리데이', code: 'WORKING_HOLIDAY' },
	{ name: '영주권', code: 'GREEN_CARD' },
	{ name: '소통', code: 'COMMUNICATION' },
	{ name: '질문/답변', code: 'QNA' },
];
const { sendRequest } = useAxios();
const selectedCategory = ref({ name: '소통', code: 'COMMUNICATION' });
const selectedValue = value => {
	selectedCategory.value = value;
};

const openCategorySelect = () => {
	isCategorySelectClicked.value = true;
};

const closeSelect = () => {
	isCategorySelectClicked.value = false;
};

const alertValue = ref(false);
const alertText = ref('');

const openAlert = content => {
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

// content value
const content = ref('');

// textarea
const adjustTextarea = ref(null);
const adjustTextareaHeight = () => {
	const textarea = adjustTextarea.value;
	textarea.style.height = 'auto';
	textarea.style.height = `${textarea.scrollHeight}px`;
};

// tags
const hashTag = ref('');
const tags = ref([]);

const isImageUploaded = computed(() => imagePreview.value.length > 0);

const imageFile = ref([]);
const imagePreview = ref([]);

const hashTagArea = ref(false);

const imagePaths = ref([]);

// preview image
const previewImage = event => {
	const input = event.target;
	if (imagePreview.value.length > 2) {
		openAlert('이미지는 최대 3개까지만 등록이 가능합니다.');
		return;
	}
	if (input.files && input.files[0]) {
		const reader = new FileReader();
		reader.onload = e => {
			imagePreview.value.push(e.target.result);
			imageFile.value.push(input.files[0]);
		};
		reader.readAsDataURL(input.files[0]);
	}
};

// 미리보기 삭제
const removeImage = index => {
	imagePreview.value.splice(index, 1);
};

const emit = defineEmits(['onPostModal:value']);

// close modal
const closeModal = () => {
	emit('onPostModal:value', false);
};

const removeSpecialCharacters = str => {
	// 특수 문자를 제거하기 위한 정규식
	const regex = /[^\wㄱ-ㅎㅏ-ㅣ가-힣]/gi;
	return str.replace(regex, '');
};

const addTag = () => {
	if (tags.value.length > 7) {
		openAlert('태그는 최대 8개까지만 등록이 가능합니다.');
		return;
	}
	const sanitizedTag = removeSpecialCharacters(hashTag.value);
	tags.value.push(sanitizedTag);
	hashTag.value = ''; // 입력 필드 비우기
};

const removeTag = tag => {
	tags.value.splice(tags.value.indexOf(tag), 1);
};

const hashTagAreaOpen = () => {
	hashTagArea.value = true;
};

// image upload
const imageUpload = async () => {
	if (imageFile.value.length === 0) {
		openAlert('이미지를 업로드 해주세요.');
		return;
	}
	try {
		const formData = new FormData();
		imageFile.value.forEach(file => {
			formData.append('multipartFile', file);
		});
		const { status, data } = await sendRequest(
			'post',
			'/images?imagePath=content',
			{
				headers: {
					contentType: 'multipart/form-data',
				},
			},
			formData,
		);
		if (status === 200) {
			data.data.forEach(image => {
				imagePaths.value.push(image);
			});
		} else {
			openAlert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
		}
	} catch (error) {
		console.log(error);
	}
};

const postUpload = async () => {
	if (imageFile.value.length > 0) {
		await imageUpload();
	}
	if (!title.value) {
		openAlert('제목을 입력해주세요.');
		return;
	}
	if (!content.value) {
		openAlert('내용을 입력해주세요.');
		return;
	}
	try {
		const requstForm = {
			title: title.value,
			content: content.value,
			tags: tags.value,
			attachments: imagePaths.value,
			isPublic: privateYn.value === 'N' ? true : false,
			category: selectedCategory.value.code,
		};
		const { status } = await sendRequest(
			'post',
			'/posts',
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			},
			requstForm,
		);
		debugger;
		if (status === 201) {
			closeModal();
			openAlert('게시글이 등록되었습니다.');
		}
	} catch (error) {
		console.log(error);
	}
};

watch(content, adjustTextareaHeight);
</script>
