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
								<button type="reset" v-if="searchInput !== ''" class="input__button-remove" title="텍스트삭제"
									@click="initializeSearchInput"></button>
							</div>
							<button type="button" class="button button--close" @click="closeModal">
								<i class="blind">취소</i>
							</button>
						</div>
					</div>
				</div>
				<!-- 검색결과 -->
				<div class="search-result-wrap">
					<ul class="search-result">
						<li v-for="(item, index) in filteredSearchHistory.slice(0, 20)" :key="'history-' + index" class="item">
							<button type="button" class="button button--result-recently" @click="reCallSearchApi(item as string)">
								<em>{{ item }}</em>
							</button>
							<p class="item__fnc">
								<button type="button" class="button button--del" @click="removeSearchHistory(index)">
									<i class="blind">삭제</i>
								</button>
							</p>
						</li>
						<li v-for="(result, resultIndex) in searchResult" :key="'result-' + resultIndex" class="item">
							<button type="button" class="button button--result">
								<em>{{ result.title }}</em>
								<em>{{ result.userNickName }}</em>
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

<script setup lang="ts">
import type { ISearchResult } from '@/types/interface';
import { onMounted, ref, computed } from 'vue';
import { applicationJsonWithToken } from '@/utils/header';
import { IApiSearchResult, IPageable } from '@/types/api-interface';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { AxiosResponse } from 'axios';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import SearchResult from '../board/SearchResult.vue';
import api from '@/api';

const userInfo = useUserInfoStore();
const searchInput = ref('');
const searchHistory = ref<String[]>([]);
const searchResult = ref<ISearchResult[]>([]);
const searchApiCalled = ref(false);
const isLoading = ref(false);
const page = ref(0);

const state = ref({
	posts: [] as ISearchResult[],
	pagination: {} as IPageable,
	loading: false,
	last: false,
});

const emits = defineEmits(['update:searchModalValue']);

// 모달 닫기
const closeModal = () => {
	emits('update:searchModalValue', false);
};

// <-- 로딩 관련
const onLoading = () => {
	isLoading.value = true;
};

const offLoading = () => {
	isLoading.value = false;
};
// --> 

// 검색 api호출
const callSearchApi = async () => {
	onLoading();
	stackSearchHistory();
	try {
		const response: AxiosResponse<IApiSearchResult> = await api.get(
			`/posts/search?keyword=${searchInput.value}&page=${page.value}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			response.data.data.content.forEach((element: any) => {
				response.data.data.content.forEach((element: ISearchResult) => {
					state.value.posts.push(element);
				});
			});
			state.value.pagination = response.data.data.pageable;
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

// 검색 api 재호출
const reCallSearchApi = (item: string) => {
	searchInput.value = item;
	searchApiCalled.value = true;
	callSearchApi();
};

// 히스토리 쌓기
const stackSearchHistory = () => {
	if (!searchInput.value) return;

	let storedHistoryRaw = localStorage.getItem('searchInputs');
	let storedHistory: string[] = storedHistoryRaw ? JSON.parse(storedHistoryRaw) : [];

	// 새 검색어를 배열의 맨 앞에 추가
	storedHistory.unshift(searchInput.value);

	// 중복을 제거하여 새 배열 생성
	storedHistory = Array.from(new Set<string>(storedHistory));

	localStorage.setItem('searchInputs', JSON.stringify(storedHistory));
	searchHistory.value = storedHistory;
};

const removeSearchHistory = (index: number) => {
	// 해당 인덱스의 검색 기록 삭제
	searchHistory.value.splice(index, 1);

	// 로컬 스토리지 업데이트
	localStorage.setItem('searchInputs', JSON.stringify(searchHistory.value));
};

// 검색어 초기화
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
</script>
