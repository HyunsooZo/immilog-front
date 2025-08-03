<template>
	<!-- searchdialog -->
	<div class="content _full _search">
		<!-- 검색 -->
		<div class="search-wrap">
			<div class="input-wrap">
				<div class="input__inner">
					<div class="input__inner-item">
						<input
							v-model="searchInput"
							type="search"
							id="inputSrch"
							class="input__element input__element--search"
							:placeholder="t('searchView.searchPlaceHolder')"
							autocomplete="off"
							@keyup.enter="callSearchApi(page)"
						/>
						<button
							type="reset"
							v-if="searchInput !== ''"
							class="input__button-remove"
							title="텍스트삭제"
							@click="initializeSearchInput"
						></button>
					</div>
					<button type="button" class="button button--close" @click="onBack">
						<i class="blind">취소</i>
					</button>
				</div>
			</div>
		</div>
		<!-- 검색결과 -->
		<div class="search-result-wrap">
			<ul class="search-result">
				<li
					v-for="(item, index) in filteredSearchHistory.slice(0, 20)"
					:key="'history-' + index"
					class="item"
				>
					<button
						type="button"
						class="button button--result-recently"
						@click="reCallSearchApi(item)"
					>
						<em>{{ item }}</em>
					</button>
					<p class="item__fnc">
						<button
							type="button"
							class="button button--del"
							@click="removeSearchHistory(index)"
						>
							<i class="blind">삭제</i>
						</button>
					</p>
				</li>
				<li
					v-for="(result, resultIndex) in searchResult"
					:key="'result-' + resultIndex"
					class="item"
				>
					<button type="button" class="button button--result">
						<em>{{ result.title }}</em>
						<em>{{ result.userNickName }}</em>
						<em>{{ result.content }}</em>
						<em>{{ result.createdAt }}</em>
					</button>
				</li>
			</ul>
			<div class="list-wrap">
				<SearchResult
					v-for="(item, index) in state.posts"
					:key="index"
					:post="item"
				/>
			</div>
		</div>
	</div>
	<LoadingModal v-if="isLoading" />
</template>

<script setup lang="ts">
import type { IApiSearchResult, IPageable } from '@/features/board/types/index';
import type { ISearchResult } from '@/shared/types/common';
import { onMounted, ref, computed, onUnmounted, watch } from 'vue';
import { applicationJsonWithToken } from '@/shared/utils/header';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { AxiosResponse } from 'axios';
import LoadingModal from '@/shared/components/ui/LoadingModal.vue';
import SearchResult from '@/features/board/components/SearchResult.vue';
import api from '@/core/api/index';

const userInfo = useUserInfoStore();
const { t } = useI18n();

const router = useRouter();

const searchInput = ref('');
const searchResult = ref<ISearchResult[]>([]);
const searchApiCalled = ref(false);
const isLoading = ref(false);
const page = ref(0);

const state = ref({
	posts: [] as ISearchResult[],
	pagination: {} as IPageable,
	loading: false,
});

defineEmits(['update:searchModalValue']);

// 뒤로 가기 기능
const onBack = () => {
	router.back();
};

// <-- 검색 로딩 관련 함수
const onLoading = () => {
	isLoading.value = true;
};

const offLoading = () => {
	isLoading.value = false;
};
// -->

// 검색 API 호출
const callSearchApi = async (pageNumber: number) => {
	onLoading();
	stackSearchHistory();
	initializeStateIfKeywordChanged();
	try {
		const response: AxiosResponse<IApiSearchResult> = await api.get(
			`/api/v1/posts?search=${searchInput.value}&page=${pageNumber}`,
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

// 검색 기록 재검색
const reCallSearchApi = (item: string) => {
	searchInput.value = item;
	searchApiCalled.value = true;
	callSearchApi(0);
};

// 검색 기록 추가
const searchHistory = ref<string[]>([]); // 타입 명시적으로 선언

const stackSearchHistory = () => {
	if (!searchInput.value) return;

	let storedHistoryRaw = localStorage.getItem('searchInputs');
	let storedHistory: string[] = storedHistoryRaw
		? JSON.parse(storedHistoryRaw)
		: [];

	// 새 검색어를 배열의 맨 앞에 추가
	storedHistory.unshift(searchInput.value);

	// 중복을 제거하여 새 배열 생성
	storedHistory = Array.from(new Set<string>(storedHistory));

	localStorage.setItem('searchInputs', JSON.stringify(storedHistory));
	searchHistory.value = storedHistory;
};

// 검색 기록 삭제
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
	initializeState();
};

// State 초기화
const initializeState = () => {
	state.value.posts = [];
	page.value = 0;
	state.value.pagination = {} as IPageable;
};

// 검색어 변경 여부
const isValueSearchValueChanged = ref(false);

// 검색어 변경 감지
watch(searchInput, (oldValue, newValue) => {
	if (oldValue !== newValue) {
		isValueSearchValueChanged.value = true;
	}
});

// 검색어 빈값일 경우 초기화
watch(searchInput, newValue => {
	if (newValue === '') {
		initializeState();
	}
});

// 페이지 마운트
onMounted(() => {
	// 초기 검색 기록 로드
	const storedHistory = localStorage.getItem('searchInputs');
	if (storedHistory) {
		searchHistory.value = JSON.parse(storedHistory);
	}
	window.addEventListener('scroll', handleScroll);
});

// 페이지 언마운트
onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});

const filteredSearchHistory = computed(() => {
	return !searchInput.value && !searchApiCalled.value
		? searchHistory.value
		: [];
});

// 호출 가능 상태를 추적하는 변수
let canCall = true;

// 스크롤 이벤트 핸들러
const handleScroll = () => {
	if (!canCall) return; // canCall이 false면 함수를 종료

	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	if (scrollTop + clientHeight >= scrollHeight - 10) {
		callSearchApi(++page.value);
		canCall = false; // 함수 호출 후 canCall을 false로 설정
		setTimeout(() => {
			canCall = true; // 3초 후에 canCall을 true로 변경
		}, 3000); // 3초 후에 다시 호출할 수 있도록 설정
	}
};

// 검색어 변경 시 초기화
const initializeStateIfKeywordChanged = () => {
	if (isValueSearchValueChanged.value) {
		state.value.posts = [];
		page.value = 0;
		state.value.pagination = {} as IPageable;
		isValueSearchValueChanged.value = false; // 초기화 후 상태 변경
	}
};
</script>
