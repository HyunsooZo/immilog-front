<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap" :class="{ active: isStickyWrap }">
			<SearchBar />
			<!-- tab button -->
			<div class="menu-wrap">
				<ul class="menu__inner">
					<li
						v-for="(menu, index) in menus"
						:key="index"
						:class="{ active: menu.active.value }"
						class="menu__list"
					>
						<button
							type="button"
							@click="selectMenu(menu)"
							class="button"
							:aria-selected="Boolean(menu.active.value)"
						>
							{{ menu.label }}
						</button>
					</li>
				</ul>
				<span
					class="menu__bar"
					:style="{ left: menuBarLeft, width: menuBarWidth }"
				></span>
			</div>
		</div>

		<div class="list-top-wrap">
			<!-- 카테고리 선택 (홈화면 스타일) -->
			<div class="fnc-wrap category-buttons-horizontal">
				<div class="sub-menu-wrap">
					<ul class="sub-menu__inner">
						<li
							v-for="category in categoryList"
							:key="category.code"
							class="sub-menu__list"
							:class="{ active: selectCategoryValue.code === category.code }"
						>
							<button 
								type="button" 
								class="button" 
								@click="selectCategory(category)"
							>
								{{ t(category.name) }}
							</button>
						</li>
					</ul>
				</div>
			</div>
			<!-- 정렬 -->
			<div class="fnc-wrap">
				<div class="sort__list">
					<button
						type="button"
						class="button--select sort"
						@click="openSortingSelect"
					>
						<span>{{ t(selectSortingValue.name) }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- 목록 -->
		<!-- <BoardContent /> -->
		<div class="list-wrap">
			<!-- 글쓰기버튼 -->
			<button
				type="button"
				class="button-icon button--post _sticky"
				:class="{ active: isStickyButton }"
				:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : '' }"
				@click="openPostModal"
			>
				<svg viewBox="0 0 16 16">
					<path :d="postBtn.first" />
					<path :d="postBtn.second" />
				</svg>
				<i class="blind">글쓰기</i>
			</button>
			<!-- 초기 로딩 시 시머 이펙트 -->
			<PostListShimmer v-if="isInitialLoading" :count="5" />
			
			<!-- 게시물 목록 -->
			<div v-else v-for="(item, index) in state.posts" :key="item.postId">
				<BoardContent
					:post="item"
					:detail="false"
					:jobPost="emptyJobPost"
					:boardType="BoardType.POST"
				/>
			</div>
		</div>
	</div>
	<PostModal
		v-if="onPostModal"
		:isJobBoard="false"
		@onPostModal:value="closePostModal"
	/>
	<SelectDialog
		v-if="isSortingSelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
	<teleport to="#modal" v-if="alertValue">
		<CustomAlert
			:alertValue="alertValue"
			:alertText="alertText"
			@update:alertValue="closeAlert"
		/>
	</teleport>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { postBtn } from '@/shared/utils/icons';
import { categoryList, sortingList } from '@/shared/utils/selectItems';
import { useI18n } from 'vue-i18n';
import type { ISelectItem, IState } from '@/shared/types/common';
import { BoardType } from '@/shared/types/common';
import type { IApiPosts, ISelectMenu } from '@/features/board/types/index';
import { useRouter } from 'vue-router';
import { applicationJsonWithToken } from '@/shared/utils/header';
import { AxiosResponse } from 'axios';
import { emptyJobPost } from '@/shared/utils/emptyObjects';
import SearchBar from '@/shared/components/common/SearchBar.vue';
import SelectDialog from '@/shared/components/ui/SelectDialog.vue';
import PostModal from '@/features/board/components/PostModal.vue';
import BoardContent from '@/features/board/components/BoardContent.vue';
import CustomAlert from '@/shared/components/ui/CustomAlert.vue';
import PostListShimmer from '@/shared/components/ui/PostListShimmer.vue';
import api from '@/core/api/index';

const { t } = useI18n();
const alertValue = ref(false);
const alertText = ref('');
const country = ref('');
const interestCountry = ref<string | undefined>('');

const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
};

const closeAlert = () => {
	alertValue.value = false;
};

const router = useRouter();
// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// 스크롤 :상단고정영역, 글쓰기버튼
const isStickyWrap = ref(false);
const isStickyButton = ref(false);
const StickyWrapHeight = ref(0);
onMounted(() => {
	window.addEventListener('scroll', handleStickyWrap);
	const listTopElement = document.querySelector(
		'.list-top-wrap',
	) as HTMLElement | null;
	let listTopHeight = listTopElement?.getBoundingClientRect().height;

	if (typeof listTopHeight === 'number') {
		let boundHandleStickyButton = handleStickyButton.bind(null, listTopHeight);

		window.addEventListener('scroll', boundHandleStickyButton);

		return () => {
			window.removeEventListener('scroll', handleStickyWrap);
			window.removeEventListener('scroll', boundHandleStickyButton);
		};
	}
});
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

/* 사용자 정보 Store */
const userInfo = useUserInfoStore();

// .menu-wrap
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

let menus = [
	{ label: t('postView.myCountry'), active: ref(true) },
	{ label: t('postView.interestCountry'), active: ref(false) },
];

const selectMenu = async (selectedMenu: ISelectMenu) => {
	const isInterestCountryMenu =
		selectedMenu.label === t('postView.interestCountry');
	if (isInterestCountryMenu && !userInfo.userInterestCountry) {
		openAlert(t('postView.noInterestCountry'));
		return;
	}
	selectedMenu.active.value = true;
	menus
		.filter(menu => menu !== selectedMenu)
		.forEach(menu => {
			menu.active.value = false;
		});
	nextTick(() => {
		updateMenuBar();
	});
	selectCategoryValue.value = {
		name: 'selectItems.allCategories',
		code: 'ALL',
	};
	currentPage.value = 0;
	selectSortingValue.value = {
		name: 'selectItems.sortByRecent',
		code: 'CREATED_DATE',
	};
	initState();
	if (isInterestCountryMenu) {
		country.value = interestCountry.value
			? interestCountry.value
			: country.value;
	} else {
		country.value = userInfo.userCountry ? userInfo.userCountry : '';
	}
};

const updateMenuBar = () => {
	const activeButton = document.querySelector(
		'.menu__list.active .button',
	) as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

const selectTitle = ref('');
const selectList = ref<ISelectItem[]>([]);
const currentPage = ref(0);

// .category__list
const selectCategoryValue = ref({
	name: 'selectItems.allCategories',
	code: 'ALL',
});
// 카테고리 선택 함수
const selectCategory = (category: ISelectItem) => {
	selectCategoryValue.value = category;
};

// .sort__list
const selectSortingValue = ref({
	name: 'selectItems.sortByRecent',
	code: 'CREATED_DATE',
});
const isSortingSelectClicked = ref(false);

const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.sorting');
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
	isModalOpen();
};

// 로딩 상태
const isInitialLoading = ref(true);

// 게시글 목록 관련 반응형 객체
const state = ref<IState>({
	posts: [],
	pagination: {
		sort: {
			sorted: false,
			unsorted: true,
			empty: true,
		},
		pageSize: 10,
		pageNumber: 0,
		offset: 0,
		paged: true,
		unpaged: false,
	},
	last: false,
	loading: false,
});

const initState = () => {
	state.value = {
		posts: [],
		pagination: {
			sort: {
				sorted: false,
				unsorted: true,
				empty: true,
			},
			pageSize: 10,
			pageNumber: 0,
			offset: 0,
			paged: true,
			unpaged: false,
		},
		last: false,
		loading: false,
	};
};

const selectedValue = (value: ISelectItem) => {
	if (sortingList.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
	}
};

const closeSelect = () => {
	isSortingSelectClicked.value = false;
	// 선택 값이 변경되면 watch가 자동으로 fetchBoardList를 호출함
	isModalClose();
};


// 무한 스크롤 관련 메소드 (데이터 추가 호출)
const loadMoreData = async () => {
	if (!state.value.last && !state.value.loading) {
		state.value.loading = true;
		currentPage.value += 1;
		await fetchBoardList(
			country.value,
			selectSortingValue.value.code,
			currentPage.value,
		);
		state.value.loading = false; // fetchBoardList 호출 후 loading 상태 변경
	}
};

const fetchBoardList = async (
	country: string,
	sortingMethod: string,
	nextPage: number,
) => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiPosts> = await api.get(
			`/api/v1/posts?country=${country}` +
				`&category=${selectCategoryValue.value.code.toUpperCase()}` +
				`&sort=${sortingMethod}` +
				`&isPublic=${'N'}` +
				`&page=${nextPage}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			// 마지막 페이지 여부 설정
			state.value.last = response.data.data.last;
			// 새로운 게시물들을 기존 목록에 추가
			response.data.data.content.forEach((post: any) => {
				if (state.value.posts) {
					state.value.posts.push(post);
				}
			});
			state.value.pagination = response.data.data.pageable;
		}
	} catch (error) {
		console.error(error);
	} finally {
		state.value.loading = false;
		// 첫 페이지 로딩이 완료되면 초기 로딩 상태 해제
		if (nextPage === 0) {
			isInitialLoading.value = false;
		}
	}
};

watch([selectSortingValue, selectCategoryValue, country], () => {
	// 변경 시 목록 초기화 후 첫 페이지부터 다시 가져오기
	initState();
	currentPage.value = 0;
	fetchBoardList(
		country.value,
		selectSortingValue.value.code,
		0
	);
}, { flush: 'post' }); // DOM 업데이트 후에 실행

onMounted(() => {
	if (!userInfo.accessToken) {
		router.push('/sign-in');
	}
	country.value = userInfo.userCountry ? userInfo.userCountry : '';
	interestCountry.value = userInfo.userInterestCountry
		? userInfo.userInterestCountry
		: undefined;
	updateMenuBar();
	// country 값 설정으로 watch가 트리거되어 fetchBoardList가 자동 호출됨
	window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 10) {
		loadMoreData();
	}
};

// .post--dialog open
const onPostModal = ref(false);
const openPostModal = () => {
	onPostModal.value = true;
	isModalOpen();
};
const closePostModal = () => {
	// 게시글 작성 후 목록 새로고침
	initState();
	currentPage.value = 0;
	fetchBoardList(country.value, selectSortingValue.value.code, 0);
	onPostModal.value = false;
	isModalClose();
};
</script>

<style scoped>
/* BoardPage 카테고리 버튼 강제 가로 배치 */
.category-buttons-horizontal .sub-menu__inner {
  display: flex !important;
  flex-direction: row !important;
  gap: 0.5rem !important;
  flex-wrap: nowrap !important;
}

.category-buttons-horizontal .sub-menu__list {
  flex-shrink: 0 !important;
}
</style>
