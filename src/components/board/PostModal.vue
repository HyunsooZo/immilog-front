<template>
	<!-- postdialog -->
	<div class="modal modal--full post--dialog">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">글쓰기</p>
				<button type="button" class="button-icon__s button--post_upload" @click="postUpload">
					<svg viewBox="0 0 16 16">
						<path :d="postRegistrationIcon.first" />
						<path :d="postRegistrationIcon.second" />
					</svg>
					<span>등록</span>
				</button>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="post-wrap">
					<!-- 일반게시판 -->
					<!-- 카테고리 선택 -->
					<div class="fnc-wrap">
						<div class="category__list">
							<button type="button" class="button--select" @click="openCategorySelect">
								<span>{{ selectedCategory.name }}</span>
							</button>
						</div>
					</div>
					<!-- 공개 권한 선택 -->
					<div class="input-wrap">
						<div class="input__wrap radio-type">
							<div class="input__item">
								<input v-model="privateYn" type="radio" class="input__radio" id="allCountries" name="postSelect" value="N"
									checked />
								<label for="allCountries" class="input__label">모든 국가에 공개</label>
							</div>
							<div class="input__item">
								<input v-model="privateYn" type="radio" class="input__radio" id="onlyMyCountry" name="postSelect"
									value="Y" @click="
										openAlert(
											'내 국가에만 공개 선택 시<br>같은 국가 사용자만 해당 게시물을 볼 수 있습니다.',
										)
										" />
								<label for="onlyMyCountry" class="input__label">내 국가에만 공개</label>
							</div>
						</div>
					</div>
					<!-- //일반게시판 -->
					<!-- 구인구직 -->
					<div class="input-wrap">
						<em class="input__title">채용마감일</em>
						<!-- 채용마감일 -->
						<div class="input__wrap underline-type">
							<div class="input__item">
								<input type="checkbox" class="input__checkbox _text" id="allDate" name="dateSelect" />
								<label for="allDate" class="input__label">상시채용</label>
							</div>
							<div class="input__item">
								<div class="input__item_inner">
									<input type="date" :min="minDate" v-model="selectedDate" @input="updateDate" class="input__element"
										data-placeholde="채용마감일을 선택해주세요." />
								</div>
							</div>
							<!-- <div class="input__item">
								<div class="input__item_inner">
									<DatePicker v-model="selectedDate" :format="formatDate" :enable-time-picker="false" week-start="0"
										position="left" placeholder="날짜를 선택하세요." auto-applyclass="datepicker" class="select__item" />
								</div>
							</div> -->
						</div>
						<!-- 경력선택 -->
						<div class="input__wrap radio-type">
							<div class="input__item">
								<input type="radio" class="input__checkbox _text" id="allCareer" name="careerSelect" />
								<label for="allCareer" class="input__label">경력무관</label>
							</div>
							<div class="input__item">
								<input type="radio" class="input__checkbox" id="selCareer" name="careerSelect"
									@click="openAlert('경력 선택 팝업')" />
								<label for="selCareer" class="input__label">경력선택</label>
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
										<input v-model="title" type="text" class="input__element" placeholder="제목을 입력해주세요."
											autocomplete="off" />
									</div>
								</div>
							</div>
						</div>
						<!-- contents -->
						<div class="post__content">
							<div class="post">
								<textarea v-model="content" class="text__area" name="content" autocomplete="off"
									placeholder="게시글 내용을 입력해주세요. 일정 수 이상의 신고를 받는 경우 글이 자동으로 숨김처리 됩니다." data-autosuggest_is-input="true"
									ref="adjustTextarea" @input="adjustTextareaHeight" rows="3"></textarea>
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
									<div class="attachments__item" v-for="(image, index) in imagePreview" :key="index">
										<div class="item__display">
											<img :src="image" alt="preview" />
											<button type="button" class="button--del" @click="removeImage(index)">
												<i class="blind">삭제</i>
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
														<input v-model="hashTag" type="text" class="input__element"
															placeholder="해시태그를 입력 후 등록 버튼을 클릭하세요" autocomplete="off" />
													</div>
												</div>
												<button type="button" class="button button--primary" @click="addTag">
													<span>등록</span>
												</button>
											</div>
										</div>
										<!-- tag__item -->
										<div class="tag__item">
											<span class="item--hash" v-for="tag in tags" :key="tag">
												<em>{{ tag }}</em>
												<button type="button" class="input__button-remove" title="텍스트삭제" @click="removeTag(tag)"></button>
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
									<input type="file" id="file-upload" multiple="multiple"
										accept="image/jpeg, image/png, image/gif, image/jpg, image/tiff" @change="previewImage" />
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
							<button type="button" class="button-icon__s" @click="hashTagAreaOpen">
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
	<CustomAlert v-if="alertValue" :alertValue="alertValue" :alertText="alertText" @update:alertValue="closeAlert" />
	<SelectDialog v-if="isCategorySelectClicked" :title="selectTitle" :list="categoryList" @close="closeSelect"
		@select:value="selectedValue" />
	<LoadingModal v-if="isLoading" />
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import CustomAlert from '@/components/modal/CustomAlert.vue';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import { useRouter } from 'vue-router';
import { resizeImage } from '@/utils/image.js';
import { categoryList } from '@/utils/selectItems';
import { uploadPostApi } from '@/services/post.js';
import { uploadImageApi } from '@/services/image.js';
import {
	postRegistrationIcon,
	imageSelectIcon,
	hashTagIcon,
} from '@/utils/icons.js';
// import DatePicker from 'vue3-datepicker';

// DatePicker
// const today = new Date();
// const year = today.getFullYear();
// const month = (today.getMonth() + 1).toString().padStart(2, '0');
// const day = today.getDate().toString().padStart(2, '0');
// const minDate = `${year}-${month}-${day}`;
// const DatePicker = ref('');
// const updateDate = (event) => {
// 	DatePicker.value = event.target.value;
// };

const today = new Date();
const year = today.getFullYear();
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const day = today.getDate().toString().padStart(2, '0');
const minDate = `${year}-${month}-${day}`;
const selectedDate = ref('');
const updateDate = (event) => {
	selectedDate.value = event.target.value;
};


const router = useRouter();
const isCategorySelectClicked = ref(false);
// const selectedDate = ref(new Date());

// const formatDate = date => {
// 	const year = date.getFullYear();
// 	const month = date.getMonth() + 1;
// 	const day = date.getDate();

// 	// 날짜 앞에 0을 붙여야 하는 경우
// 	if (month || day < 10) {
// 		const zeroDay = ('00' + day).slice(-2);
// 		const zeroMonth = ('00' + month).slice(-2);

// 		return `${year}.${zeroMonth}.${zeroDay}`;
// 	} else {
// 		return `${year}.${month}.${day}`;
// 	}
// };

const selectTitle = '카테고리 선택';
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

// content 변수 및 watch
const content = ref('');

// 텍스트 영역 조정 함수
const adjustTextarea = ref(null);
// update character count
const currentCharCount = ref(0);
const maxCharCount = 500;
const adjustTextareaHeight = () => {
	const textarea = adjustTextarea.value;
	textarea.style.height = 'auto';
	textarea.style.height = `${textarea.scrollHeight}px`;
	// update character count
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
const imageFile = ref([]);
const imagePreview = ref([]);
const imagePaths = ref([]);

// 프리뷰 이미지
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

// 게시물 게시 모달 닫기
const closeModal = () => {
	emit('onPostModal:value', false);
};

// tags 변수
const hashTag = ref('');
const tags = ref([]);

// 특수문자 제거 메서드
const removeSpecialCharacters = str => {
	// 특수 문자를 제거하기 위한 정규식
	const regex = /[^\wㄱ-ㅎㅏ-ㅣ가-힣]/gi;
	return str.replace(regex, '');
};

// 태그 추가 및 제거 메서드
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

// 해시태그 모달 오픈
const hashTagArea = ref(false);
const hashTagAreaOpen = () => {
	hashTagArea.value = true;
};

// 이미지 업로드 함수
const imageUpload = async () => {
	if (imageFile.value.length === 0) {
		openAlert('이미지를 업로드 해주세요.');
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
		const { status, data } = await uploadImageApi(`content`, formData);
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

// 게시물 업로드 함수
const postUpload = async () => {
	checkIfTokenExists();
	if (!validateUploadPost()) {
		return;
	}
	onLoading();
	if (imageFile.value.length > 0) {
		const { status } = await imageUpload();
		if (status !== 200) {
			offLoading();
			return;
		}
	}
	try {
		const form = createImageForm();
		const { status } = await uploadPostApi('content', form);
		if (status === 201 || status === 200) {
			setTimeout(() => {
				offLoading();
				openAlert('게시글이 등록되었습니다.');
				closeModal();
			}, 1000);
		}
	} catch (error) {
		console.log(error);
		offLoading();
	}
};

// 로딩 변수 및 로딩 on & off 함수
const isLoading = ref(false);

const onLoading = () => {
	isLoading.value = true;
};

const offLoading = () => {
	isLoading.value = false;
};

// 토큰 존재여부 체크 함수
const checkIfTokenExists = () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
	}
};

// 이미지 업로드 요청 폼 생성 함수
const createImageForm = () => {
	return {
		title: title.value,
		content: content.value,
		tags: tags.value,
		attachments: imagePaths.value,
		isPublic: privateYn.value === 'N' ? true : false,
		category: selectedCategory.value.code,
	};
};

const validateUploadPost = () => {
	if (!title.value) {
		openAlert('제목을 입력해주세요.');
		return false;
	}
	if (!content.value) {
		openAlert('내용을 입력해주세요.');
		return false;
	}
	return true;
};
</script>
