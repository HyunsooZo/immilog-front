<template>
	<!-- searchdialog -->
	<div class="modal modal--full search--dialog">
		<div class="modal-content">
			<div class="modal-body">
				<!-- 검색 -->
				<div class="search-wrap">
					<div class="input-wrap">
						<div class="input__inner">
							<div class="input__inner-item">
								<input v-model="searchInput" type="search" id="inputSrch" class="input__element input__element--search"
									placeholder="검색어를 입력 후 엔터를 눌러주세요" autocomplete="off" @keyup.enter="callSearchApi" />
								<button v-if="searchInput !== ''" type="reset" class="input__button-remove" title="텍스트삭제"
									@click="initializeSearchInput"></button>
							</div>
							<button class="button button--close" role="link" @click="closeSearchModal">
								<i class="blind">취소</i>
							</button>
						</div>
					</div>
				</div>
				<!-- 검색결과 -->
				<div class="search-result-wrap">
					<ul class="search-result">
						<li v-for="(item, index) in filteredSearchHistory.slice(0, 20)" :key="'history-' + index" class="item">
							<button type="button" class="button button--result-recently" @click="reCallSearchApi(item)">
								<em>{{ item }}</em>
							</button>
							<p class="item__fnc">
								<button type="button" class="button button--del" @click="removeSearchHistory(index)">
									<i class="blind">삭제</i>
								</button>
							</p>
						</li>
						<li v-for="(result, resultIndex) in searchResult.content" :key="'result-' + resultIndex" class="item">
							<button type="button" class="button button--result">
								<em>{{ result.title }}</em>
								<em>{{ result.author }}</em>
								<em>{{ result.content }}</em>
								<em>{{ result.createdAt }}</em>
							</button>
						</li>
					</ul>
					<div class="list-wrap">
						<SearchResult v-for="(item, index) in state.posts" :key="index" :post="item" />
					</div>
				</div>
			</div>
		</div>
	</div>
	<LoadingModal v-if="isLoading" />
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import useAxios from '@/composables/useAxios';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import { useRouter } from 'vue-router';
import SearchResult from '../board/SearchResult.vue';
const router = useRouter();

const { sendRequest } = useAxios(router);

const searchInput = ref('');
const searchHistory = ref([]);
const searchResult = ref([]);
const searchApiCalled = ref(false);
const isLoading = ref(false);
const page = ref(0);

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const emits = defineEmits(['update:searchModalValue']);

const closeSearchModal = () => {
	emits('update:searchModalValue', false);
};

const onLoading = () => {
	isLoading.value = true;
};

const offLoading = () => {
	isLoading.value = false;
};

const callSearchApi = async () => {
	onLoading();
	stackSearchHistory();
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts/search?keyword=${searchInput.value}&page=${page.value}`,
			{
				headers: {
					contentType: 'application/json',
					Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
				},
			},
			null,
		);
		if (status === 200) {
			state.value.posts = data.data.content;
			state.value.pagination = data.data.pagination;
			setTimeout(() => {
				offLoading();
			}, 1500);
		}
	} catch (error) {
		console.error(error);
	} finally {
		offLoading();
	}
};

const reCallSearchApi = item => {
	searchInput.value = item;
	searchApiCalled.value = true;
	callSearchApi();
};

const stackSearchHistory = () => {
	if (!searchInput.value) return;

	let storedHistory = localStorage.getItem('searchInputs');
	storedHistory = storedHistory ? JSON.parse(storedHistory) : [];

	// 새 검색어를 배열의 맨 앞에 추가
	storedHistory.unshift(searchInput.value);

	storedHistory = [...new Set(storedHistory)];

	localStorage.setItem('searchInputs', JSON.stringify(storedHistory));
	searchHistory.value = storedHistory;
};

const removeSearchHistory = index => {
	// 해당 인덱스의 검색 기록 삭제
	searchHistory.value.splice(index, 1);

	// 로컬 스토리지 업데이트
	localStorage.setItem('searchInputs', JSON.stringify(searchHistory.value));
};

const initializeSearchInput = () => {
	searchInput.value = '';
	searchApiCalled.value = false;
};

onMounted(() => {
	// 초기 검색 기록 로드
	const storedHistory = localStorage.getItem('searchInputs');
	if (storedHistory) {
		searchHistory.value = JSON.parse(storedHistory);
	}
});

const filteredSearchHistory = computed(() => {
	return !searchInput.value && !searchApiCalled.value
		? searchHistory.value
		: [];
});

// const filteredSearchResult = computed(() => {
// 	return searchApiCalled.value ? searchResult.value : [];
// });
</script>
