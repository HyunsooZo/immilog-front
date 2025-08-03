<template>
	<div class="search-wrap _search" :class="{ active: isSearchOpen }">
		<div class="input-wrap">
			<div class="input__inner">
				<button
					class="button button--search"
					role="link"
					@click="openSearchInput"
				>
					<i class="blind">검색</i>
				</button>
				<div class="input__inner-wrap">
					<div class="input__inner-item">
						<input
							v-model="searchInput"
							type="search"
							id="inputSrch"
							class="input__element input__element--search"
							placeholder="검색어를 입력 후 엔터를 눌러주세요"
							autocomplete="off"
							@keyup.enter="sendSearchValue"
						/>
						<button
							v-if="searchInput !== ''"
							type="reset"
							class="input__button-remove"
							title="텍스트삭제"
							@click="initializeSearchInput"
						></button>
					</div>
					<button
						class="button button--close"
						role="link"
						@click="closeSearchInput"
					>
						<i class="blind">취소</i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isSearchOpen = ref(false);
const searchInput = ref('');

const openSearchInput = () => {
	isSearchOpen.value = true;
};
const closeSearchInput = () => {
	searchInput.value = '';
	isSearchOpen.value = false;
	emit('refetchChatRooms');
};

const initializeSearchInput = () => {
	searchInput.value = '';
};

const emit = defineEmits(['searchValue', 'refetchChatRooms']);

const sendSearchValue = () => {
	if (searchInput.value === '') {
		return;
	}
	emit('searchValue', searchInput.value);
};
</script>
