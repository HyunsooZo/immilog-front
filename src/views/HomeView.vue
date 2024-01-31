<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<div class="sticky-wrap active">
			<!-- //scroll up addClass .active / scroll down removeClass .active -->
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

		<!-- 카테고리 정렬 -->
		<div class="flexbox-wrap border--bot">
			<div class="category__list">
				<button
					type="button"
					class="button--select"
					@click="openCategorySelect"
				>
					{{ selectCategoryValue.name }}
				</button>
			</div>
			<div class="sort__list">
				<button
					type="button"
					class="button--select sort"
					@click="openSortingSelect"
				>
					{{ selectSortingValue.name }}
				</button>
			</div>
		</div>
		<!-- sub menu -->
		<CountryList @select:country="setCountry" />
		<!-- 목록 -->
		<div class="list-wrap">
			<div class="list__title">
				<span class="title">{{ selectCategoryValue.name }} </span>
			</div>
			<BoardContent
				v-for="(item, index) in state.posts"
				:key="index"
				:post="item"
			/>
			<DummyBoard />
		</div>
	</div>
	<SelectDialog
		v-if="isCategorySelectClicked || isSortingSelectClicked"
		:title="selectTitle"
		:list="selectList"
		@close="closeSelect"
		@select:value="selectedValue"
	/>
</template>

<script setup>
// import TheFooter from '@/components/layouts/TheFooter.vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import SearchBar from '@/components/SearchBar.vue'; // .search-wrap
import SelectDialog from '@/components/SelectDialog.vue'; // .select--dialog
import CountryList from '@/components/CountryList.vue'; // .sub-menu-wrap
import BoardContent from '@/components/BoardContent.vue';
import useAxios from '@/composables/useAxios.js';
import DummyBoard from '@/components/DummyBoard.vue';

const menuBarLeft = ref('0px');
const menuBarWidth = ref('0px');
const selectTitle = ref('');
const selectList = ref('');
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref({ name: '전체', code: 'all' });
const selectSortingValue = ref({ name: '최신순', code: 'recent' });
const selectCountry = ref({ name: '전체', code: 'all' });
const currentPage = ref(0);
const { sendRequest } = useAxios();
const sortingList = [
	{ name: '최신순', code: 'CREATED_DATE' },
	{ name: '좋아요순', code: 'LIKE_COUNT' },
	{ name: '조회순', code: 'VIEW_COUNT' },
	{ name: '댓글순', code: 'COMMENT_COUNT' },
];
const categoryList = [
	{ name: '전체', code: 'all' },
	{ name: '워킹홀리데이', code: 'workingholiday' },
	{ name: '영주권', code: 'greencard' },
	{ name: '소통', code: 'communication' },
	{ name: '질문/답변', code: 'qanda' },
];

let menus = [
	{ label: '최신글', active: ref(true) },
	{ label: '인기글', active: ref(false) },
];

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

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
};

const openSortingSelect = () => {
	nextTick(() => {
		selectTitle.value = '정렬 기준 선택';
		selectList.value = sortingList;
		isSortingSelectClicked.value = true;
	});
};

const updateMenuBar = () => {
	const activeButton = document.querySelector('.menu__list.active .button');
	menuBarLeft.value = activeButton ? `${activeButton.offsetLeft}px` : '0px';
	menuBarWidth.value = activeButton ? `${activeButton.offsetWidth}px` : '0px';
};

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
			`/posts?country=${selectCountry.value.code.toUpperCase()}&sortingMethod=${sortingMethod}&isPublic=${'Y'}&page=${nextPage}`,
			{
				headers: {
					contentType: 'multipart/form-data',
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

const setCountry = country => {
	selectCountry.value = country;
};

watch(
	[selectSortingValue, selectCountry, selectCategoryValue],
	fetchBoardList(selectCategoryValue.value, currentPage.value),
);

onMounted(() => {
	updateMenuBar();
	fetchBoardList('CREATED_DATE', 0, {
		headers: {
			contentType: 'multipart/form-data',
		},
	});
});
</script>
