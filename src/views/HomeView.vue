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
							@click="selectMenu(menu)"
							type="button"
							class="button"
							:aria-selected="menu.active.value.toString()"
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
			<CountryList @select:country="setCountry" />
			<!-- 카테고리 및 정렬 옵션 -->
			<div class="fnc-wrap">
				<div class="category__list">
					<button
						type="button"
						class="button--select"
						@click="openCategorySelect"
					>
						<span>{{ selectCategoryValue.name }}</span>
					</button>
				</div>
				<div class="sort__list">
					<button
						type="button"
						class="button--select sort"
						@click="openSortingSelect"
					>
						<span>{{ selectSortingValue.name }}</span>
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
				:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : null }"
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
				:item="'글'"
			/>
			<BoardContent
				v-for="(item, index) in state.posts"
				:key="index"
				:post="item"
			/>
		</div>
	</div>
	<LoadingModal v-if="isLoading" />
	<PostModal v-if="onPostModal" @onPostModal:value="closePostModal" />
	<SelectDialog
		v-if="isCategorySelectClicked || isSortingSelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import SearchBar from '@/components/search/SearchBar.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import CountryList from '@/components/selections/CountryList.vue';
import BoardContent from '@/components/board/BoardContent.vue';
import useAxios from '@/composables/useAxios.js';
import PostModal from '@/components/board/PostModal.vue';
import NoContent from '@/components/board/NoContent.vue';
import { useRouter } from 'vue-router';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { postBtn } from '@/utils/icons';
import { sortingList, categoryList } from '@/utils/selectItems.js';

const router = useRouter();
const { sendRequest } = useAxios(router);

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
const handleScrollEvent = () => {
	window.addEventListener('scroll', handleStickyWrap);
	const listTopHeight = document
		.querySelector('.list-top-wrap')
		?.getBoundingClientRect().height;
	window.addEventListener(
		'scroll',
		handleStickyButton.bind(null, listTopHeight),
	);
	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
		window.removeEventListener(
			'scroll',
			handleStickyButton.bind(null, listTopHeight),
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
const handleStickyButton = listTopHeight => {
	isStickyButton.value = window.scrollY > listTopHeight;
};

const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

// select 관련 상태 및 메소드
const selectTitle = ref('');
const selectList = ref('');
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref({ name: '전체', code: 'ALL' });
const selectSortingValue = ref({ name: '최신순', code: 'CREATED_DATE' });
const selectCountry = ref({ name: '전체', code: 'ALL' });

// select 관련 메소드 (메뉴)
const selectMenu = selectedMenu => {
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

// select 관련 메소드 (카테고리 및 정렬)
const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = '카테고리 선택';
		selectList.value = categoryList;
		isCategorySelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (정렬)
const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = '정렬 기준 선택';
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
};

// select 관련 메소드 (선택된 값 처리)
const selectedValue = value => {
	if (categoryList.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
	} else if (sortingList.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
	}
	initializeState();
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// select 관련 메소드 (초기화)
const initializeState = () => {
	state.value.posts = [];
	state.value.pagination = {};
	currentPage.value = 0;
};

// select 관련 메소드 (닫기)
const closeSelect = () => {
	isCategorySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	modalCloseClass();
};

// select 관련 메소드 (국가 선택)
const setCountry = value => {
	selectCountry.value = value;
	initializeState();
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// 게시글 목록 관련 상태
let menus = [
	{ label: '최신글', active: ref(true) },
	{ label: '인기글', active: ref(false) },
];

// 게시글 목록 관련 반응형 객체
const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

// 메뉴바 관련 메소드
const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button');
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

// 게시글 목록 관련 페이징 값
const currentPage = ref(0);

// 게시글 목록 호출 메서드
const fetchBoardList = async (sortingMethod, nextPage) => {
	state.value.loading = true;
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts
			?country=${selectCountry.value.name}&
			sortingMethod=${sortingMethod}&
			isPublic=${'Y'}&
			category=${selectCategoryValue.value.code}&
			page=${nextPage}`,
			{
				headers: {
					contentType: 'multipart/form-data',
				},
			},
		);
		if (status === 200) {
			data.data.content.forEach(post => state.value.posts.push(post));
			state.value.pagination = data.data.pageable;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
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
	if (!state.value.pagination.last && !state.value.loading) {
		state.value.loading = true;
		currentPage.value += 1;
		await fetchBoardList(selectSortingValue.value.code, currentPage.value);
		state.value.loading = false; // fetchBoardList 호출 후 loading 상태 변경
	}
};

// PostModal 오픈 및 닫기
const onPostModal = ref(false);
const openPostModal = () => {
	onPostModal.value = true;
};
const closePostModal = () => {
	onPostModal.value = false;
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

// 로딩화면 관련 상태
const isLoading = ref(false);

onMounted(async () => {
	updateMenuBar();
	handleScrollEvent();
	if (useUserInfoStore().userSeq === null) {
		isLoading.value = true;
		setTimeout(() => {
			fetchBoardList('CREATED_DATE', 0);
			setTimeout(() => {
				isLoading.value = false;
			}, 1000);
		}, 4000);
	} else {
		fetchBoardList('CREATED_DATE', 0);
		window.addEventListener('scroll', handleScroll);
	}
});
</script>
