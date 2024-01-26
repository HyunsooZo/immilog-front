<template>
	<!-- searchdialog -->
	<div class="modal-container search--dialog">
		<div class="modal">
			<div class="modal-content">
				<div class="modal-body">
					<!-- 검색 -->
					<div class="search-wrap active">
						<div class="input-wrap">
							<p class="logo-wrap">
								<img src="@/assets/images/icon-komeet.png" alt="ko-meet" />
							</p>
							<div class="input__inner">
								<button class="button button--search" role="link">
									<span class="blind">관심 있는 글 검색</span>
								</button>
								<div class="input__inner-item">
									<input v-model="searchInput" type="search" id="inputSrch" class="input__element input__element--search"
										placeholder="검색어를 입력 후 엔터를 눌러주세요" autocomplete="off" @keyup.enter="callSearchApi" />
									<button v-if="searchInput !== ''" type="button" class="input__button-remove" title="텍스트삭제"
										@click="searchInput = ''"></button>
								</div>
								<button class="button button--back" role="link" @click="closeSearchModal">
									<span class="blind">취소</span>
								</button>
							</div>
							<button type="button" class="button-icon button--notice new" role="link">
								<span>알림</span>
							</button>
						</div>
					</div>

					<!-- 검색결과 -->
					<div class="search-result-wrap">
						<ul class="search-result">
							<li v-for="(item, index) in filteredSearchHistory" :key="'history-' + index" class="item">
								<button type="button" class="button button--result-recently">
									<em>{{ item }}</em>
								</button>
								<p class="item-fnc">
									<button type="button" class="button button--del" @click="removeSearchHistory(index)">
										<span class="blind">삭제</span>
									</button>
								</p>
							</li>
							<li v-for="(result, resultIndex) in filteredSearchResult" :key="'result-' + resultIndex" class="item">
								<button type="button" class="button button--result">
									<em>{{ result }}</em>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';

const searchInput = ref('');
const searchHistory = ref([]);
const searchResult = ref([]);
const searchApiCalled = ref(false);

const emits = defineEmits(['update:searchModalValue']);

const closeSearchModal = () => {
	emits('update:searchModalValue', false);
};

const callSearchApi = () => {
	console.log(searchInput.value);
	stackSearchHistory();
	searchApiCalled.value = true;
};

const stackSearchHistory = () => {
	if (!searchInput.value) return;

	// 로컬 스토리지에서 이전 검색 기록 불러오기
	let storedHistory = localStorage.getItem('searchInputs');
	if (!storedHistory) {
		storedHistory = [];
	} else {
		storedHistory = JSON.parse(storedHistory);
	}

	// 새 검색어 추가
	storedHistory.push(searchInput.value);

	// 로컬 스토리지에 저장
	localStorage.setItem('searchInputs', JSON.stringify(storedHistory));

	// 검색어 초기화
	searchInput.value = '';

	// 검색 기록 업데이트
	searchHistory.value = storedHistory;
};

const removeSearchHistory = index => {
	// 해당 인덱스의 검색 기록 삭제
	searchHistory.value.splice(index, 1);

	// 로컬 스토리지 업데이트
	localStorage.setItem('searchInputs', JSON.stringify(searchHistory.value));
};

onMounted(() => {
	// 초기 검색 기록 로드
	const storedHistory = localStorage.getItem('searchInputs');
	if (storedHistory) {
		searchHistory.value = JSON.parse(storedHistory);
	}

	// 가상 검색 결과 데이터 (테스트용)
	searchResult.value = ['검색결과1', '검색결과2', '검색결과3'];
});

const filteredSearchHistory = computed(() => {
	return !searchInput.value && !searchApiCalled.value
		? searchHistory.value
		: [];
});

const filteredSearchResult = computed(() => {
	return searchApiCalled.value ? searchResult.value : [];
});
</script>
