<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">내 게시물</p>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<BoardContent v-for="(item, index) in state.posts" :key="index" :post="item" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { applicationJsonWithToken } from '@/utils/header';
import { IApiPosts } from '@/types/api-interface';
import { IState } from '@/types/interface';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import BoardContent from '@/components/board/BoardContent.vue';
import { AxiosResponse } from 'axios';
import api from '@/api';

const userInfo = useUserInfoStore();

const props = defineProps<{
	userSeq: number;
}>();

const state = ref<IState>({
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

const fetchMyPostList = async (page: number) => {
	state.value.loading = true;
	try {
		const response: AxiosResponse<IApiPosts> = await api.get(
			`/posts/users/${props.userSeq}/page/${page}`,
			applicationJsonWithToken(userInfo.accessToken)
		);
		if (response.status === 200) {
			state.value.posts = response.data.data.content;
		}
	} catch (error) {
		console.log(error);
	} finally {
		state.value.loading = false;
	}
};

//모달 닫는 에밋 (false 넘김)
const emits = defineEmits(['close']);

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

const closeModal = () => {
	emits('close');
	modalCloseClass();
};

onMounted(() => {
	fetchMyPostList(0);
	modalOpenClass();
});
</script>
