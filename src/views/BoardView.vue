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

		<div class="list-top-wrap" ref="listTop">
			<!-- 카테고리 정렬 -->
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

		<!-- 목록 -->
		<!-- <BoardContent /> -->
		<div class="list-wrap">
			<!-- 글쓰기버튼 -->
			<button
				type="button"
				class="button-icon button--post sticky"
				:class="{ active: isButtonActive }"
				@click="openPostModal"
			>
				<svg viewBox="0 0 16 16">
					<path
						d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
					/>
					<path
						d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
					/>
				</svg>
				<span class="blind">글쓰기</span>
			</button>
			<div class="list__title" style="display: none">
				<span class="title">{{ selectCategoryValue.name }}</span>
				<!-- 글쓰기버튼 -->
				<button
					type="button"
					class="button-icon button--post"
					@click="openPostModal"
				>
					<svg viewBox="0 0 16 16">
						<path
							d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
						/>
						<path
							d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
						/>
					</svg>
					<span class="blind">글쓰기</span>
				</button>
			</div>
			<div>
				<BoardContent
					v-for="(item, index) in state.posts"
					:key="index"
					:post="item"
				/>
			</div>
		</div>
	</div>
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
import { nextTick, onMounted, ref, watch } from 'vue';
import SearchBar from '@/components/SearchBar.vue'; // .search-wrap
import SelectDialog from '@/components/SelectDialog.vue'; // .select--dialog
import useAxios from '@/composables/useAxios.js';
import PostModal from '@/components/PostModal.vue'; // .post--dialog
import BoardContent from '@/components/BoardContent.vue';
import { useUserInfoStore } from '@/stores/userInfo.js';
import { modalOpenClass, modalCloseClass } from '@/services/utils';

// 스크롤 :상단고정영역, 글쓰기버튼
const isStickyWrap = ref(false);
const listTop = ref(null);
const isStickyButton = ref(false);
onMounted(() => {
	window.addEventListener('scroll', handleStickyWrap);
	const listTopHeight = listTop.value?.getBoundingClientRect().height;
	window.addEventListener(
		'scroll',
		handleStickyButton.bind(null, listTopHeight),
	);
});
const handleStickyWrap = () => {
	isStickyWrap.value = window.scrollY > 0;
};
const handleStickyButton = listTopHeight => {
	isStickyButton.value = window.scrollY > listTopHeight;
};

/* 사용자 정보 Store */
const userInfo = useUserInfoStore();

// .menu-wrap
const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');

let menus = [
	{ label: '내지역', active: ref(true) },
	{ label: '관심지역', active: ref(false) },
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

const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button');
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

const selectTitle = ref('');
const selectList = ref('');
const currentPage = ref(0);
const { sendRequest } = useAxios();

// .category__list
const selectCategoryValue = ref({ name: '전체', code: 'all' });
const isCategorySelectClicked = ref(false);
const categoryList = [
	{ name: '전체', code: 'all' },
	{ name: '워킹홀리데이', code: 'workingholiday' },
	{ name: '영주권', code: 'greencard' },
	{ name: '소통', code: 'communication' },
	{ name: '질문/답변', code: 'qanda' },
];

const openCategorySelect = () => {
	nextTick(() => {
		selectTitle.value = '카테고리 선택';
		selectList.value = categoryList;
		isCategorySelectClicked.value = true;
	});
	modalOpenClass();
};

// .sort__list
const selectSortingValue = ref({ name: '최신순', code: 'recent' });
const isSortingSelectClicked = ref(false);
const sortingList = [
	{ name: '최신순', code: 'CREATED_DATE' },
	{ name: '좋아요순', code: 'LIKE_COUNT' },
	{ name: '조회순', code: 'VIEW_COUNT' },
	{ name: '댓글순', code: 'COMMENT_COUNT' },
];

const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = '정렬 기준 선택';
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
	modalOpenClass();
};

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const selectedValue = value => {
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

const inquireBoardList = (category, sorting) => {
	console.log(category, sorting);
	console.log('inquireBoardList');
};

// const loadMoreData = () => {
// 	if (!state.value.pagination.last && !state.value.loading) {
// 		state.value.loading = true;
// 		const nextPage = state.value.pagination.number + 1;
// 		fetchBoardList(nextPage);
// 	}
// };

const fetchBoardList = async (sortingMethod, nextPage) => {
	state.value.loading = true;
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts?country=${
				userInfo.userCountry
			}&category=${selectCategoryValue.value.code.toUpperCase()}&sortingMethod=${sortingMethod}&isPublic=${'Y'}&page=${nextPage}`,
			{
				headers: {
					contentType: 'multipart/application/json',
					Authorization: `Bearer ${userInfo.accessToken}`,
				},
			},
		);
		if (status === 200) {
			state.value.posts = data.data.content;
			state.value.pagination = data.data.pageable;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
	}
};

watch(
	[selectSortingValue, selectCategoryValue],
	fetchBoardList(selectCategoryValue.value, currentPage.value),
);

watch(
	() => userInfo.userCountry,
	() => {
		fetchBoardList(selectCategoryValue.value, currentPage.value);
	},
);

onMounted(() => {
	updateMenuBar();
	fetchBoardList('CREATED_DATE', 0);
});

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
