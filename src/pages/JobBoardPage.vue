<template>
	<div class="content">
		<TheTopBox :title="t('jobContent.jobPost')" />
		<SearchBox />
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button
						type="button"
						class="button--select"
						@click="openCategorySelect"
					>
						<span>{{ t(selectIndustryValue.name) }}</span>
					</button>
				</div>
				<div class="sort__list">
					<button
						type="button"
						class="button--select sort"
						@click="openSortingSelect"
					>
						<span>{{ t(selectSortingValue.name) }}</span>
					</button>
				</div>
				<!-- 글쓰기 버튼 -->
				<button
					type="button"
					class="button-icon button--post"
					:class="{ active: isStickyButton }"
					:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : 'auto' }"
					@click="openPostModal"
				>
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
			<!-- 초기 로딩 시 시머 이펙트 -->
			<PostListShimmer v-if="isInitialLoading" :count="5" />
			
			<!-- 게시물이 없는 경우 -->
			<NoContent
				v-else-if="!isInitialLoading && state.jobPosts.length === 0"
				:item="t('jobContent.jobPost')"
			/>
			
			<!-- 게시물 목록 -->
			<div v-else v-for="(item, index) in state.jobPosts" :key="index">
				<BoardContent
					:jobPost="item"
					:adValue="showAd(index)"
					:boardType="BoardType.JOBBOARD"
					:post="emptyPost"
					:detail="false"
				/>
			</div>
		</div>
	</div>
	<SelectDialog
		v-if="isIndustrySelectClicked || isSortingSelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
	<PostModal
		v-if="onPostModal"
		:isJobBoard="true"
		@onPostModal:value="closePostModal"
	/>
</template>

<script setup lang="ts">
import type { IJobPost, ISelectItem } from '@/shared/types/common';
import { BoardType } from '@/shared/types/common';
import type { IApiJobPost } from '@/features/board/types';
import type { IPageable } from '@/shared/types/common';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { postBtn } from '@/shared/utils/icons';
import {
	sortingList2,
	experienceList,
	industryList,
} from '@/shared/utils/selectItems';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showAd } from '@/shared/utils/showAd';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { applicationJsonWithToken } from '@/shared/utils/header';
import { AxiosResponse } from 'axios';
import { emptyPost } from '@/shared/utils/emptyObjects';
import TheTopBox from '@/shared/components/common/TheTopBox.vue';
import SearchBox from '@/shared/components/common/SearchBox.vue';
import BoardContent from '@/features/board/components/BoardContent.vue';
import SelectDialog from '@/shared/components/ui/SelectDialog.vue';
import PostModal from '@/features/board/components/PostModal.vue';
import SubMenuList from '@/shared/components/ui/SubMenuList.vue';
import NoContent from '@/shared/components/ui/NoContent.vue';
import PostListShimmer from '@/shared/components/ui/PostListShimmer.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const router = useRouter();

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
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

	const listTopElement = document.querySelector(
		'.list-top-wrap',
	) as HTMLElement;
	let listTopHeight = listTopElement?.getBoundingClientRect().height;

	stickyButtonHandler = () => {
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
	isModalOpen();
};
const closePostModal = () => {
	onPostModal.value = false;
	initializeState();
	fetchJobBoardList();
	isModalClose();
};

const state = ref({
	jobPosts: [] as IJobPost[],
	pagination: {} as IPageable,
	loading: false,
});

const currentPage = ref(0);
const selectedCountry = ref('ALL');
const selectedSortingMethod = ref('CREATED_DATE');
const isInitialLoading = ref(true);

const fetchJobBoardList = async () => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiJobPost> = await api.get(
			`/api/jobboards?country=${selectedCountry.value}` +
				`&page=${currentPage.value}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			state.value.jobPosts = response.data.data.content;
			state.value.pagination = response.data.data.pageable;
		} else if (response.status === 401) {
			fetchJobBoardList();
		}
	} catch (error) {
		console.error(error);
	} finally {
		state.value.loading = false;
		// 첫 페이지 로딩이 완료되면 초기 로딩 상태 해제
		if (currentPage.value === 0) {
			isInitialLoading.value = false;
		}
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
	isInitialLoading.value = true;
	state.value.jobPosts = [] as IJobPost[];
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
	isModalOpen();
};

// select 관련 메소드 (정렬)
const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.sorting');
		selectList.value = sortingList2;
		isSortingSelectClicked.value = true;
	});
	isModalOpen();
};

// select 관련 메소드 (닫기)
const closeSelect = () => {
	isIndustrySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	isModalClose();
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
