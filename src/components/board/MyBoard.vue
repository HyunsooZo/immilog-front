<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">내 게시물</p>
				<button
					class="button-icon button--close"
					role="link"
					@click="closeModal"
				>
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<BoardContent
						v-for="(item, index) in state.posts"
						:key="index"
						:post="item"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import BoardContent from '@/components/board/BoardContent.vue';
import { getMyPostsApi } from '@/services/post.js';

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const fetchMyPostList = async page => {
	state.value.loading = true;
	try {
		const { status, data } = getMyPostsApi(page);
		if (status === 200) {
			state.value.posts = data.data.content;
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
});
</script>
