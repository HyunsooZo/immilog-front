<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap" :class="{ active: isStickyWrap }">
			<SearchBar />
			<!-- tab button -->
			<div class="menu-wrap">
				<ul class="menu__inner">
					<li v-for="(menu, index) in menus" :key="index" :class="{ active: menu.active.value }" class="menu__list">
						<button @click="selectMenu(menu)" type="button" class="button" :aria-selected="menu.active.value.toString()">
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
						<span>{{ selectCategoryValue.name }}</span>
					</button>
				</div>
				<div class="sort__list">
					<button type="button" class="button--select sort" @click="openSortingSelect">
						<span>{{ selectSortingValue.name }}</span>
					</button>
				</div>
			</div>
			<!-- sub menu -->
			<CountryList @select:country="setCountry" />
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<!-- 글쓰기버튼 -->
			<button type="button" class="button-icon button--post _sticky" :class="{ active: isStickyButton }"
				:style="{ top: isStickyButton ? StickyWrapHeight + 'px' : null }" @click="openPostModal">
				<svg viewBox="0 0 16 16">
					<path
						d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
					<path
						d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
				</svg>
				<i class="blind">글쓰기</i>
			</button>
			<NoContent v-if="state.posts.length === 0" :item="'글'" />
			<BoardContent v-for="(item, index) in state.posts" :key="index" :post="item" />
		</div>
	</div>
	<PostModal v-if="onPostModal" @onPostModal:value="closePostModal" />
	<SelectDialog v-if="isCategorySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
		@close="closeSelect" @select:value="selectedValue" />
</template>

<script setup>
// import TheFooter from '@/components/layouts/TheFooter.vue';
import { nextTick, onMounted, ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import SelectDialog from '@/components/SelectDialog.vue';
import CountryList from '@/components/CountryList.vue';
import BoardContent from '@/components/BoardContent.vue';
import useAxios from '@/composables/useAxios.js';
import PostModal from '@/components/PostModal.vue';
import NoContent from '@/components/NoContent.vue';
import { modalOpenClass, modalCloseClass } from '@/services/utils';

// 스크롤 :상단고정영역, 글쓰기버튼
const isStickyWrap = ref(false);
const isStickyButton = ref(false);
const StickyWrapHeight = ref(0);
onMounted(() => {
	window.addEventListener('scroll', handleStickyWrap);
	const listTopHeight = document.querySelector('.list-top-wrap')?.getBoundingClientRect().height;
	window.addEventListener('scroll', handleStickyButton.bind(null, listTopHeight));
	return () => {
		window.removeEventListener('scroll', handleStickyWrap);
		window.removeEventListener('scroll', handleStickyButton.bind(null, listTopHeight));
	};
});
const handleStickyWrap = () => {
	isStickyWrap.value = window.scrollY > 0;
	if (isStickyButton.value) {
		const stickyWrapElement = document.querySelector('.sticky-wrap');
		StickyWrapHeight.value = (stickyWrapElement?.getBoundingClientRect().height || 0) + 5;
	}
};
const handleStickyButton = listTopHeight => {
	isStickyButton.value = window.scrollY > listTopHeight;
};

const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

/* select variable & methods start */
const selectTitle = ref('');
const selectList = ref('');
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref({ name: '전체', code: 'ALL' });
const selectSortingValue = ref({ name: '최신순', code: 'CREATED_DATE' });
const selectCountry = ref({ name: '전체', code: 'ALL' });
const sortingList = [
	{ name: '최신순', code: 'CREATED_DATE' },
	{ name: '좋아요순', code: 'LIKE_COUNT' },
	{ name: '조회순', code: 'VIEW_COUNT' },
	{ name: '댓글순', code: 'COMMENT_COUNT' },
];
const categoryList = [
	{ name: '전체', code: 'ALL' },
	{ name: '워킹홀리데이', code: 'WORKING_HOLIDAY' },
	{ name: '영주권', code: 'GREEN_CARD' },
	{ name: '소통', code: 'COMMUNICATION' },
	{ name: '질문/답변', code: 'QNA' },
];

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

const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = '카테고리 선택';
		selectList.value = categoryList;
		isCategorySelectClicked.value = true;
	});
	modalOpenClass();
};

const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = '정렬 기준 선택';
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
};

const selectedValue = value => {
	if (categoryList.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
	} else if (sortingList.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
	}
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

const closeSelect = () => {
	isCategorySelectClicked.value = false;
	isSortingSelectClicked.value = false;
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
	modalCloseClass();
};
/* select end */

const currentPage = ref(0);
const { sendRequest } = useAxios();

let menus = [
	{ label: '최신글', active: ref(true) },
	{ label: '인기글', active: ref(false) },
];

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button');
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

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

const setCountry = value => {
	selectCountry.value = value;
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

const loadMoreData = async () => {
	if (!state.value.pagination.last && !state.value.loading) {
		state.value.loading = true;
		const nextPage = state.value.pagination.pageNumber + 1;
		await fetchBoardList('CREATED_DATE', nextPage); // await 추가
		state.value.loading = false; // fetchBoardList 호출 후 loading 상태 변경
	}
};
// .post--dialog open
const onPostModal = ref(false);
const openPostModal = () => {
	onPostModal.value = true;
};
const closePostModal = () => {
	onPostModal.value = false;
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

const handleScroll = () => {
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 10) {
		loadMoreData();
	}
};

onMounted(() => {
	updateMenuBar();
	fetchBoardList('CREATED_DATE', 0);
	window.addEventListener('scroll', handleScroll);
});
</script>
