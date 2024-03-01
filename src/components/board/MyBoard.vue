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
import useAxios from '@/composables/useAxios';
import { useUserInfoStore } from '@/stores/userInfo';
import { modalCloseClass } from '@/utils/date-time.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const { sendRequest } = useAxios(router);

const userInfo = useUserInfoStore();

const state = ref({
	posts: [],
	pagination: {},
	loading: false,
});

const fetchBookmarkList = async () => {
	state.value.loading = true;
	try {
		const { status, data } = await sendRequest('get', `/posts/my?page=0`, {
			headers: {
				contentType: 'application/json',
				Authorization: `Bearer ${userInfo.accessToken}`,
			},
		});
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

const closeModal = () => {
	emits('close');
	modalCloseClass();
};

onMounted(() => {
	fetchBookmarkList();
});
</script>
