<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">{{ t('bookMarkView.bookMark') }}</p>
				<button
					type="button"
					class="button-icon button--close"
					@click="closeModal"
				>
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body" ref="scrollBody">
				<div class="list-wrap">
					<BoardContent
						v-for="(item, index) in state.posts"
						:key="item.postId"
						:post="item"
						:jobPost="emptyJobPost"
						:boardType="BoardType.POST"
						:detail="false"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { getBookmarkedPostApi } from '@/features/board/services/post';
import { useI18n } from 'vue-i18n';
import { emptyJobPost } from '@/shared/utils/emptyObjects';
import { BoardType } from '@/shared/types/common';
import BoardContent from '@/features/board/components/BoardContent.vue';

const { t } = useI18n();

const emits = defineEmits(['update:bookmarkValue']);

// 상태 초기화 함수
const initializeState = () => ({
	posts: [],
	pagination: {},
	loading: false,
});

const state = ref(initializeState());

// 메뉴 탭 제거 - 일반 게시글 북마크만 표시

const closeModal = () => {
	emits('update:bookmarkValue', false);
};

const fetchBookmarkList = async () => {
	state.value.loading = true;
	try {
		const response = await getBookmarkedPostApi();
		if (response.status === 200 && 'data' in response) {
			state.value.posts = response.data.data;
		}
	} catch (error) {
		console.error(error);
	} finally {
		state.value.loading = false;
	}
};

const scrollBody = ref<HTMLElement | null>(null);

onMounted(() => {
	fetchBookmarkList();
});

onUnmounted(() => {
	// cleanup if needed
});
</script>
