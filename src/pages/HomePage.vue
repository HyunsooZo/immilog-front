<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap" :class="{ active: isStickyWrap }">
			<SearchBar />
			<!-- 탭 메뉴 -->
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
							:aria-selected="menu.active.value ? 'true' : 'false'"
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
			<!-- 서브 메뉴 -->
			<SubMenuList
				:subMenus="getContriesWithAll()"
				@select:country="setCountry"
			/>
			<!-- 카테고리 및 정렬 옵션 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button
						type="button"
						class="button--select"
						@click="openCategorySelect"
					>
						<span>{{ t(selectCategoryValue.name) }}</span>
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
			</div>
		</div>

		<!-- 게시글 목록 -->
		<div class="list-wrap">
			<!-- 글쓰기 버튼 -->
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
			<NoContent
				v-if="state.pagination.sort && state.posts.length === 0"
				:item="t('homeView.post')"
			/>
			<BoardContent
				v-for="(item, index) in state.posts"
				:key="index"
				:post="item"
				:showAd="showAd(index)"
				:detail="false"
				:jobPost="emptyJobPost"
				:isJobBoard="false"
			/>
		</div>
	</div>
	<LoadingModal v-if="isLoading" />
	<PostModal
		v-if="onPostModal"
		:isJobBoard="false"
		@onPostModal:value="closePostModal"
	/>
	<SelectDialog
		v-if="isCategorySelectClicked || isSortingSelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
	<CustomAlert
		v-if="alertValue"
		:alertText="alertText"
		@update:alertValue="closeAlert"
	/>
</template>

<script setup lang="ts">
import type {
	IPost,
	ISelectItem,
	IState,
	IUserInfo,
} from '@/shared/types/common';
import type { IApiPosts, IApiUserInfo } from '@/features/auth/types/index';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { postBtn } from '@/shared/utils/icons';
import { sortingList, categoryList } from '@/shared/utils/selectItems';
import { showAd } from '@/shared/utils/showAd';
import { useI18n } from 'vue-i18n';
import { countries } from '@/shared/utils/selectItems';
import { useHomeCategoryStore } from '@/features/board/stores/category';
import { useHomeSortingStore } from '@/features/board/stores/sorting';
import { getCoordinate } from '@/shared/services/geolocation';
import { getUserInfo } from '@/features/profile/services/userInfoFetch';
import { AxiosResponse } from 'axios';
import { emptyJobPost } from '@/shared/utils/emptyObjects';
import CustomAlert from '@/shared/components/ui/CustomAlert.vue';
import SearchBar from '@/shared/components/common/SearchBar.vue';
import SelectDialog from '@/shared/components/ui/SelectDialog.vue';
import BoardContent from '@/features/board/components/BoardContent.vue';
import PostModal from '@/features/board/components/PostModal.vue';
import NoContent from '@/features/board/components/NoContent.vue';
import LoadingModal from '@/shared/components/ui/LoadingModal.vue';
import SubMenuList from '@/shared/components/ui/SubMenuList.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const router = useRouter();

const userInfo = useUserInfoStore();
const homeCategory = useHomeCategoryStore();
const homeSorting = useHomeSortingStore();

const sortingListWithoutLike = sortingList.filter(
	s => s.code !== 'LIKE_COUNT' && s.code !== 'CREATED_DATE',
);

const getContriesWithAll = () => {
	return [{ name: 'country.all', code: 'ALL' }, ...countries];
};

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// 스크롤 관련 상태 및 이벤트 핸들러
const isStickyWrap = ref(false);
const isStickyButton = ref(false);
const StickyWrapHeight = ref(0);
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

const handleScrollEvent = () => {
	window.addEventListener('scroll', handleStickyWrap);

	// handleStickyButton top '.list-top-wrap' 요소의 높이를 가져오기 (높이가 없다면 0으로 처리)
	const listTopHeight: number =
		document.querySelector('.list-top-wrap')?.getBoundingClientRect().height ||
		0;
	window.addEventListener('scroll', () => handleStickyButton(listTopHeight));

	// 이벤트 제거를 위한 함수 반환
	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
		window.removeEventListener('scroll', () =>
			handleStickyButton(listTopHeight),
		);
	};
};
const handleStickyWrap = () => {
	isStickyWrap.value = window.scrollY > 0;
	if (isStickyButton.value) {
		const stickyWrapElement = document.querySelector('.sticky-wrap');
		StickyWrapHeight.value =
			(stickyWrapElement?.getBoundingClientRect().height || 0) + 5;
	}
};
// 글쓰기 버튼 스크롤 이벤트
const handleStickyButton = (listTopHeight: number) => {
	isStickyButton.value = window.scrollY > listTopHeight;
};
// 메뉴바 관련 메소드
const updateMenuBar = () => {
	const activeButton = document.querySelector(
		'.menu__list.active .button',
	) as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

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

// select 관련 메소드 (초기화)
const initializeState = () => {
	state.value = {
		posts: [],
		pagination: {
			sort: {
				sorted: false,
				unsorted: false,
				empty: false,
			},
			pageSize: 0,
			pageNumber: 0,
			offset: 0,
			paged: false,
			unpaged: false,
		},
		last: false,
		loading: false,
	};
	currentPage.value = 0; // currentPage 초기화
};

// select 관련 메소드 (국가 선택)
const setCountry = (value: { name: string; code: string }) => {
	selectCountry.value = value;
	initializeState();
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// select 관련 상태 및 메소드
const selectTitle = ref('');
const selectList = ref<ISelectItem[]>([]);
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref<ISelectItem>({
	name: homeCategory.name ? homeCategory.name : 'selectItems.allCategories',
	code: homeCategory.code ? homeCategory.code : 'ALL',
});
const selectSortingValue = ref<ISelectItem>({
	name: homeSorting.name ? homeSorting.name : 'selectItems.sortByRecent',
	code: homeSorting.code ? homeSorting.code : 'CREATED_DATE',
});
const selectCountry = ref({ name: '전체', code: 'ALL' });

// select 관련 메소드 (메뉴)
const selectMenu = async (selectedMenu: { active: any; label?: string }) => {
	// 먼저 posts 배열 초기화
	state.value.posts = [];
	state.value.last = false;
	currentPage.value = 0;

	if (selectedMenu.label === t('homeView.recentPost')) {
		const recent = { name: 'selectItems.sortByRecent', code: 'CREATED_DATE' };
		selectSortingValue.value = recent;
		homeSorting.setSorting(recent);
	} else if (selectedMenu.label === t('homeView.popularPost')) {
		const like = { name: 'selectItems.sortByLike', code: 'LIKE_COUNT' };
		selectSortingValue.value = like;
		homeSorting.setSorting(like);
	}

	selectedMenu.active.value = true;
	menus
		.filter(menu => menu !== selectedMenu)
		.forEach(menu => {
			menu.active.value = false;
		});

	// 메뉴바 업데이트 후 데이터 fetch
	await nextTick(() => {
		updateMenuBar();
	});

	await fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// select 관련 메소드 (카테고리 및 정렬)
const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.category');
		selectList.value = categoryList;
		isCategorySelectClicked.value = true;
	});
	isModalOpen();
};

// select 관련 메소드 (정렬)
const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = t('subMenuList.sorting');
		selectList.value = sortingListWithoutLike;
		isSortingSelectClicked.value = true;
	});
	isModalOpen();
};

// select 관련 메소드 (닫기)
const closeSelect = () => {
	isCategorySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	isModalClose();
};

// select 관련 메소드 (선택된 값 처리)
const selectedValue = async (value: ISelectItem) => {
	if (categoryList.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
		homeCategory.setCategory(value);
	} else if (sortingListWithoutLike.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
		homeSorting.setSorting(value);
	}

	state.value.posts = [];
	state.value.last = false;
	currentPage.value = 0;

	await fetchBoardList(selectSortingValue.value.code, currentPage.value);
	closeSelect(); // 선택 후 모달 닫기
};

// 게시글 목록 관련 상태
let menus = [
	{ label: t('homeView.recentPost'), active: ref(true) },
	{ label: t('homeView.popularPost'), active: ref(false) },
];

// 게시글 목록 관련 페이징 값
const currentPage = ref(0);

// 게시글 목록 호출 메서드
const fetchBoardList = async (sortingMethod: string, nextPage: number) => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiPosts> = await api.get(
			`/api/v1/posts?country=${selectCountry.value.code}` +
				`&sort=${sortingMethod}` +
				`&isPublic=Y` +
				`&category=${selectCategoryValue.value.code}` +
				`&page=${nextPage}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		updateStateWithResponse(response); // 상태 업데이트 함수 호출
	} catch (error: unknown) {
		console.error(error);
	} finally {
		setTimeout(() => {
			state.value.loading = false;
		}, 1000);
	}
};

// API 응답으로 상태 업데이트 함수
const updateStateWithResponse = (response: AxiosResponse<IApiPosts>) => {
	if (response.data.status === 200) {
		state.value.last = response.data.data.last;
		response.data.data.content.forEach((item: IPost) => {
			state.value.posts.push(item);
		});
		state.value.pagination = response.data.data.pageable;
	}
};

// 무한 스크롤 관련 메소드 (스크롤 핸들링)
const handleScroll = () => {
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 10) {
		loadMoreData();
	}
};

// 무한 스크롤 관련 메소드 (데이터 추가 호출)
const loadMoreData = async () => {
	if (!state.value.last && !state.value.loading) {
		state.value.loading = true;
		currentPage.value += 1;
		await fetchBoardList(selectSortingValue.value.code, currentPage.value);
		state.value.loading = false; // fetchBoardList 호출 후 loading 상태 변경
	}
};

// <-- PostModal 오픈 및 닫기
const onPostModal = ref(false);
const openPostModal = () => {
	if (userInfo.userSeq === null) {
		router.push({ name: 'SignIn' });
	}
	onPostModal.value = true;
	isModalOpen();
};
const closePostModal = () => {
	state.value.posts = [];
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
	onPostModal.value = false;
	isModalClose();
};
// -->
const alertValue = ref(false);
const alertText = ref('');
const openAlert = (content: string) => {
	alertValue.value = true;
	alertText.value = content;
	isModalOpen();
};

const closeAlert = () => {
	alertValue.value = false;
	userInfo.setLocationMatch(true);
	isModalClose();
};

const checkIfUserLocationMatch = () => {
	if (!userInfo.isLocationMatch) {
		openAlert(t('homeView.locationMismatch'));
	}
};

const setToken = (data: IUserInfo) => {
	localStorage.setItem('accessToken', data.accessToken ? data.accessToken : '');
	localStorage.setItem(
		'refreshToken',
		data.refreshToken ? data.refreshToken : '',
	);
};

const fetchUserInfo = async () => {
	if (localStorage.getItem('accessToken') && localStorage.getItem('userSeq')) {
		await getCoordinate();
		const lat = localStorage.getItem('latitude');
		const lon = localStorage.getItem('longitude');
		if (lat && lon) {
			const response: AxiosResponse<IApiUserInfo> = await getUserInfo(
				parseFloat(lat ? lat : '0'),
				parseFloat(lon ? lon : '0'),
			);
			if (response.status === 200 || response.status === 201) {
				setToken(response.data.data);
				useUserInfoStore().setUserInfo(response.data.data);
				checkIfUserLocationMatch();
			} else {
				localStorage.removeItem('accessToken');
			}
		}
	}
};

// 로딩화면 관련 상태
const isLoading = ref(false);

// 뒤로가기 시 상태 초기화 및 데이터 새로고침
onBeforeRouteLeave(() => {
	state.value.posts = []; // posts 배열만 초기화
	state.value.last = false;
	currentPage.value = 0;
	// 정렬 방식은 유지
});

onMounted(async () => {
	updateMenuBar();
	handleScrollEvent();

	// 상태 초기화 추가
	initializeState();

	if (!userInfo.userSeq) {
		fetchUserInfo();
		isLoading.value = true;
		setTimeout(() => {
			fetchBoardList('CREATED_DATE', 0);
			setTimeout(() => {
				isLoading.value = false;
			}, 1000);
		}, 2000);
	} else {
		checkIfUserLocationMatch();
		fetchBoardList('CREATED_DATE', 0);
	}
	window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>
