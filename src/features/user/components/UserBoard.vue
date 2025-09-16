<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">내 게시물</p>
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
						:detail="false"
						:showAd="true"
						:boardType="BoardType.POST"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { applicationJsonWithToken } from '@/shared/utils/header';
import type { IApiPosts } from '@/features/board/types';
import type { ISimpleState } from '@/shared/types/common';
import { BoardType } from '@/shared/types/common';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { AxiosResponse } from 'axios';
import { emptyJobPost } from '@/shared/utils/emptyObjects';
import { useI18n } from 'vue-i18n';
import BoardContent from '@/features/board/components/BoardContent.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const userInfo = useUserInfoStore();

const props = defineProps<{
	userId: string;
}>();

const state = ref<ISimpleState>({
	posts: [],
	pagination: {
		sort: {
			sorted: false,
			unsorted: true,
			empty: true,
		},
		pageSize: 10,
		pageNumber: 0,
		offset: 0,
		paged: true,
		unpaged: false,
	},
	last: false,
	loading: false,
});

// 메뉴 탭 제거 - 일반 게시글만 표시

const fetchMyPostList = async (page: number) => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiPosts> = await api.get(
			`/api/v1/posts/users/${props.userId}?page=${page}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			state.value.posts = response.data.data.content;
		}
	} catch (error) {
		console.error(error);
	} finally {
		state.value.loading = false;
	}
};

//모달 닫는 에밋 (false 넘김)
const emits = defineEmits(['close']);

// modal open/close 시 body 컨트롤
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

const scrollBody = ref<HTMLElement | null>(null);

const closeModal = () => {
	emits('close');
	isModalClose();
};

onMounted(() => {
	fetchMyPostList(0);
	isModalOpen();
});
onUnmounted(() => {
	// cleanup if needed
});
</script>
