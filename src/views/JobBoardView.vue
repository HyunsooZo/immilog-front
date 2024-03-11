<template>
	<div class="content">
		<TheTopBox :title="'구인/구직'" />
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
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<JobContent />
		</div>
	</div>
	<SelectDialog v-if="isCategorySelectClicked || isSortingSelectClicked" :title="selectTitle" :list="selectList"
		@close="closeSelect" @select:value="selectedValue" />
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import TheTopBox from '@/components/search/TheTopBox.vue';
import JobContent from '@/components/board/JobContent.vue';
import SelectDialog from '@/components/selections/SelectDialog.vue';
import { sortingList2, categoryList2 } from '@/utils/selectItems.js';

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

// select 관련 메소드 (초기화)
const initializeState = () => {
	state.value.posts = [];
	state.value.pagination = {};
	currentPage.value = 0;
};

// select 관련 상태 및 메소드
const selectTitle = ref('');
const selectList = ref('');
const isCategorySelectClicked = ref(false);
const isSortingSelectClicked = ref(false);
const selectCategoryValue = ref({ name: '전체', code: 'ALL' });
const selectSortingValue = ref({ name: '최신순', code: 'CREATED_DATE' });

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
const selectedValue = value => {
	if (categoryList2.some(c => c.code === value.code)) {
		selectCategoryValue.value = value;
	} else if (sortingList2.some(s => s.code === value.code)) {
		selectSortingValue.value = value;
	}
	initializeState();
	fetchBoardList(selectSortingValue.value.code, currentPage.value);
};

</script>
