<template>
	<div class="content">
		<TheTopBox :title="t('jobContent.jobBoard')" />
		<SearchBox />
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button type="button" class="button--select" @click="openCategorySelect">
						<span>{{ t(selectCategoryValue.name) }}</span>
					</button>
				</div>
				<div class="sort__list">
					<button type="button" class="button--select sort" @click="openSortingSelect">
						<span>{{ t(selectSortingValue.name) }}</span>
					</button>
				</div>
				<!-- 글쓰기 버튼 -->
				<button type="button" class="button-icon button--post" :class="{ active: isStickyButton }"
					:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : 'auto' }" @click="openPostModal">
					<svg viewBox="0 0 16 16">
						<path :d="postBtn.first" />
						<path :d="postBtn.second" />
					</svg>
					<i class="blind">글쓰기</i>
				</button>
			</div>
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<!-- <NoContent v-if="state.pagination.sort && state.posts.length === 0" :item="'구인/구직 글'" /> -->
			<div v-for="(item, index) in state.jobBoards" :key="index">
				<JobContent :jobBoard="item" />
				<AdContent :showAd="showAd(index)" />
			</div>
		</div>
	</div>
	<SelectDialog v-if="isCategorySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
		@close="closeSelect" @select:value="selectedValue" />
	<PostModal v-if="onPostModal" @onPostModal:value="closePostModal" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import SearchBox from '@/components/search/SearchBox.vue';
import JobContent from '@/components/board/JobContent.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import PostModal from '@/components/board/PostModal.vue';
import AdContent from '@/components/board/AdContent.vue';
import { postBtn } from '@/utils/icons.ts';
import { sortingList2, categoryList2 } from '@/utils/selectItems.ts';
import { getJobBoardsApi } from '@/services/jobBoard.ts';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showAd } from '@/utils/showAd';
import type { ISelectItem } from '@/types/interface'
import type { IJobPost, IPageable } from '@/types/api-interface';

const { t } = useI18n();

const router = useRouter();

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

// 스크롤 관련 상태 및 이벤트 핸들러
const isStickyWrap = ref(false);
const isStickyButton = ref(false);
const StickyWrapHeight = ref(0);
let stickyButtonHandler: () => void;

const handleScrollEvent = () => {
	window.addEventListener('scroll', handleStickyWrap);

	const listTopElement = document.querySelector('.list-top-wrap') as HTMLElement;
	let listTopHeight = listTopElement?.getBoundingClientRect().height;

	const stickyButtonHandler = () => {
		if (listTopHeight !== undefined) {
			handleStickyButton(listTopHeight);
		}
	};

	if (listTopHeight !== undefined) {
		window.addEventListener('scroll', stickyButtonHandler);
	}

	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
		if (listTopHeight !== undefined) {
			window.removeEventListener('scroll', stickyButtonHandler);
		}
	};
};

// PostModal 오픈 및 닫기
const onPostModal = ref(false);
const openPostModal = () => {
	onPostModal.value = true;
	modalOpenClass();
};
const closePostModal = () => {
	onPostModal.value = false;
	// fetchBoardList(selectSortingValue.value.code, currentPage.value);
	modalCloseClass();
};

const state = ref({
	jobBoards: [] as IJobPost[],
	pagination: {} as IPageable,
	loading: false,
});

const currentPage = ref(0);
const selectedCountry = ref('ALL');
const selectedSortingMethod = ref('CREATED_DATE');
const selectedIndustry = ref('IT');
const selectedExperience = ref('JUNIOR');

const fetchJobBoardList = async () => {
	state.value.loading = true;
	try {
		const { status, data } = await getJobBoardsApi(
			selectedCountry.value,
			selectedSortingMethod.value,
			selectedIndustry.value,
			selectedExperience.value,
			currentPage.value,
		);
		if (status === 200) {
			state.value.jobBoards = data.data.content;
			state.value.pagination = data.data.pagination;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
	}
};

const handleStickyWrap = () => {
	isStickyWrap.value = window.scrollY > 0;
	if (isStickyButton.value) {
		const stickyWrapElement = document.querySelector('.sticky-wrap');
		StickyWrapHeight.value =
			(stickyWrapElement?.getBoundingClientRect().height || 0) + 5;
	}
};

const handleStickyButton = (listTopHeight: number) => {
	isStickyButton.value = window.scrollY > listTopHeight;
};

// select 관련 메소드 (초기화)
const initializeState = () => {
	state.value.jobBoards = [] as IJobPost[];
	state.value.pagination = {} as IPageable;
	currentPage.value = 0;
};

// select 관련 상태 및 메소드
const selectTitle = ref('');
const selectList = ref<ISelectItem[]>([]);
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref({
	name: 'selectItems.allCategories',
	code: 'ALL',
});
const selectSortingValue = ref({
	name: 'selectItems.sortByRecent',
	code: 'CREATED_DATE',
});

// select 관련 메소드 (카테고리 및 정렬)
const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = '카테고리 선택';
		selectList.value = categoryList2;
		isCategorySelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (정렬)
const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = '정렬 기준 선택';
		selectList.value = sortingList2;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (닫기)
const closeSelect = () => {
	isCategorySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	modalCloseClass();
};

// select 관련 메소드 (선택된 값 처리)
const selectedValue = (value: { name: string; code: string; }) => {
	if (categoryList2.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
	} else if (sortingList2.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
	}
	initializeState();
	fetchJobBoardList();
};

onMounted(async () => {
	if (localStorage.getItem('accessToken') === null) {
		router.push('/sign-in');
	}
	handleScrollEvent();
	fetchJobBoardList();
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleStickyWrap);
	if (stickyButtonHandler) {
		window.removeEventListener('scroll', stickyButtonHandler);
	}
});
</script>
