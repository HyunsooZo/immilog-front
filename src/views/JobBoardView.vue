<template>
	<div class="content">
		<TheTopBox :title="t('jobContent.jobBoard')" />
		<SearchBox />
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button type="button" class="button--select" @click="openCategorySelect">
						<span>{{ t(selectIndustryValue.name) }}</span>
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
			<SubMenuList :subMenus="experienceList" @select:country="selectedValue" />
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<NoContent v-if="state.jobBoards.length === 0" :item="t('jobContent.jobBoard')" />
			<!-- <NoContent v-if="state.pagination.sort && state.posts.length === 0" :item="'구인/구직 글'" /> -->
			<div v-for="(item, index) in state.jobBoards" :key="index">
				<JobContent :jobBoard="item" :showAd="showAd(index)" />
			</div>
		</div>
	</div>
	<SelectDialog v-if="isIndustrySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
		@close="closeSelect" @select:value="selectedValue" />
	<PostModal v-if="onPostModal" :isJobBoard=true @onPostModal:value="closePostModal" />
</template>

<script setup lang="ts">
import type { IJobPost, ISelectItem } from '@/types/interface'
import type { IApiJobPost, IPageable } from '@/types/api-interface';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { postBtn } from '@/utils/icons.ts';
import { sortingList2, experienceList, industryList } from '@/utils/selectItems.ts';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showAd } from '@/utils/showAd';
import { useUserInfoStore } from '@/stores/userInfo';
import { applicationJsonWithToken } from '@/utils/header';
import { refreshAccessToken } from '@/services/auth';
import axios, { AxiosResponse } from 'axios';
import TheTopBox from '@/components/search/TheTopBox.vue';
import SearchBox from '@/components/search/SearchBox.vue';
import JobContent from '@/components/board/JobContent.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import PostModal from '@/components/board/PostModal.vue';
import SubMenuList from '@/components/selections/SubMenuList.vue';
import NoContent from '@/components/board/NoContent.vue';

const { t } = useI18n();

const router = useRouter();

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

const userInfo = useUserInfoStore();

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

const fetchJobBoardList = async () => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiJobPost> = await axios.get(
			`/job-boards?country=${selectedCountry.value}` +
			`&sortingMethod=${selectedSortingMethod.value}` +
			`&industry=${selectIndustryValue.value.code}` +
			`&experience=${selectExperienceValue.value.code}` +
			`&page=${currentPage.value}`,
			applicationJsonWithToken(localStorage.getItem('accessToken')),
		);
		if (response.status === 200) {
			state.value.jobBoards = response.data.data.content;
			state.value.pagination = response.data.data.pageable;
		} else if (response.status === 401) {
			await refreshAccessToken();
			fetchJobBoardList();
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
const isIndustrySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectExperienceValue = ref({
	name: 'selectItems.allCategories',
	code: 'ALL',
});
const selectSortingValue = ref({
	name: 'selectItems.sortByRecent',
	code: 'CREATED_DATE',
});
const selectIndustryValue = ref({
	name: 'industry.all',
	code: 'ALL',
});


// select 관련 메소드 (카테고리 및 정렬)
const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.industry');
		selectList.value = industryList;
		isIndustrySelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (정렬)
const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.sorting');
		selectList.value = sortingList2;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (닫기)
const closeSelect = () => {
	isIndustrySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	modalCloseClass();
};

// select 관련 메소드 (선택된 값 처리)
const selectedValue = (value: ISelectItem) => {
	const name = value.name;
	switch (true) {
		case name.includes('experience'):
			selectExperienceValue.value = value;
			break;
		case name.includes('sorting2'):
			selectSortingValue.value = value;
			break;
		case name.includes('industry'):
			selectIndustryValue.value = value;
			break;
	}
	initializeState();
	fetchJobBoardList();
};

onMounted(async () => {
	if (!localStorage.getItem('accessToken')) {
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
