<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap" :class="{ active: isStickyWrap }">
			<SearchBar />
			<!-- tab button -->
			<div class="menu-wrap">
				<ul class="menu__inner">
					<li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active.value }" class="menu__list">
						<button @click="selectMenu(menu)" type="button" class="button" :aria-selected="Boolean(menu.active.value)">
							{{ menu.label }}
						</button>
					</li>
				</ul>
				<span class="menu__bar" :style="{ left: menuBarLeft, width: menuBarWidth }"></span>
			</div>
		</div>

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
			</div>
		</div>

		<!-- 목록 -->
		<!-- <BoardContent /> -->
		<div class="list-wrap">
			<!-- 글쓰기버튼 -->
			<button type="button" class="button-icon button--post _sticky" :class="{ active: isStickyButton }"
				:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : '' }" @click="openPostModal">
				<svg viewBox="0 0 16 16">
					<path :d="postBtn.first" />
					<path :d="postBtn.second" />
				</svg>
				<i class="blind">글쓰기</i>
			</button>
			<div v-for="(item, index) in state.posts" :key="index">
				<BoardContent :post="item" />
				<AdContent :showAd="showAd(index)" />
			</div>
		</div>
	</div>
	<PostModal v-if="onPostModal" @onPostModal:value="closePostModal" />
	<SelectDialog v-if="isCategorySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
		@close="closeSelect" @select:value="selectedValue" />
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import SearchBar from '@/components/search/SearchBar.vue'; // .search-wrap
import SelectDialog from '@/components/selections/SelectDialog.vue'; // .select--dialog
import useAxios from '@/composables/useAxios.ts';
import PostModal from '@/components/board/PostModal.vue'; // .post--dialog
import BoardContent from '@/components/board/BoardContent.vue';
import AdContent from '@/components/board/AdContent.vue';
import { showAd } from '@/utils/showAd.ts';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { useRouter } from 'vue-router';
import { postBtn } from '@/utils/icons.ts';
import { sortingList, categoryList } from '@/utils/selectItems.ts';
import { useI18n } from 'vue-i18n';
import { ISelectItem, type IState } from '@/types/interface';

const { t } = useI18n();

const router = useRouter();

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

// 스크롤 :상단고정영역, 글쓰기버튼
const isStickyWrap = ref(false);
const isStickyButton = ref(false);
const StickyWrapHeight = ref(0);
onMounted(() => {
	window.addEventListener('scroll', handleStickyWrap);
	const listTopElement = document.querySelector('.list-top-wrap') as HTMLElement | null;
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

const selectMenu = (selectedMenu: { active: any; label?: string; }) => {
	selectedMenu.active.value = true;
	menus
		.filter(menu => menu !== selectedMenu)
		.forEach(menu => {
			menu.active.value = false;
		});
	nextTick(() => {
		updateMenuBar();
	});
};
const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button') as HTMLElement | null;
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

const selectTitle = ref('');
const selectList = ref<ISelectItem[]>([]);
const currentPage = ref(0);
const { sendRequest } = useAxios(router);

// .category__list
const selectCategoryValue = ref({
	name: 'selectItems.allCategories',
	code: 'all',
});
const isCategorySelectClicked = ref(false);

const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = '카테고리 선택';
		selectList.value = categoryList;
		isCategorySelectClicked.value = true;
	});
	modalOpenClass();
};

// .sort__list
const selectSortingValue = ref({
	name: 'selectItems.sortByRecent',
	code: 'recent',
});
const isSortingSelectClicked = ref(false);

const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = '정렬 기준 선택';
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
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

const selectedValue = (value: { name: string; code: string; }) => {
	if (categoryList.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
	} else if (sortingList.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
	}
};

const closeSelect = () => {
	isCategorySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	inquireBoardList(selectCategoryValue.value, selectSortingValue.value);
	modalCloseClass();
};

const inquireBoardList = (category: { name: string; code: string; }, sorting: { name: string; code: string; }) => {
	console.log(category, sorting);
	console.log('inquireBoardList');
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

const fetchBoardList = async (sortingMethod: string | { name: string; code: string; }, nextPage: number) => {
	state.value.loading = true;
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts?country=${userInfo.userCountry
			}&category=${selectCategoryValue.value.code.toUpperCase()}&sortingMethod=${sortingMethod}&isPublic=${'N'}&page=${nextPage}`,
			{
				headers: {
					contentType: 'multipart/application/json',
					Authorization: `Bearer ${userInfo.accessToken}`,
				},
			},
		);
		if (status === 200) {
			data.data.content.forEach((post: any) => state.value.posts.push(post));
			state.value.pagination = data.data.pageable;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
	}
};

watch([selectSortingValue, selectCategoryValue], () => {
	fetchBoardList(selectCategoryValue.value, currentPage.value);
});

watch(
	() => userInfo.userCountry,
	() => {
		fetchBoardList(selectCategoryValue.value, currentPage.value);
	},
);

onMounted(() => {
	updateMenuBar();
	fetchBoardList('CREATED_DATE', 0);
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
	modalOpenClass();
};
const closePostModal = () => {
	onPostModal.value = false;
	modalCloseClass();
};
</script>
