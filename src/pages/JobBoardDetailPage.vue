<template>
	<TheHeader />
	<div class="content">
		<!-- 로딩 시 시머 효과 -->
		<BoardDetailShimmer v-if="isLoading" />
		
		<!-- 목록 -->
		<div class="list-wrap" v-else>
			<BoardContent
				:jobPost="jobPost"
				:detail="true"
				:post="emptyPost"
				:boardType="BoardType.JOBBOARD"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { applicationJson } from '@/shared/utils/header';
import type { IJobPost } from '@/features/board/types';
import { BoardType } from '@/shared/types/common';
import { emptyPost } from '@/shared/utils/emptyObjects';
import api from '@/core/api/index';
import TheHeader from '@/shared/components/layout/TheHeader.vue';
import BoardContent from '@/features/board/components/BoardContent.vue';
import BoardDetailShimmer from '@/shared/components/ui/BoardDetailShimmer.vue';

const route = useRoute();
const postId = route.params.postId;
const isLoading = ref(true);

const jobPost = ref<IJobPost>({
	postId: '',
	userId: '',
	userNickname: '',
	userProfileUrl: '',
	title: '',
	content: '',
	viewCount: 0,
	likeCount: 0,
	tags: [],
	attachments: [],
	likeUsers: [],
	bookmarkUsers: [],
	country: '',
	region: '',
	companyName: '',
	industry: '',
	experience: '',
	salary: '',
	workType: '',
	deadline: '',
	status: '',
	createdAt: new Date(),
});

const fetchJobBoardDetail = async () => {
	isLoading.value = true;
	try {
		const response = await api.get(`/api/jobboards/${postId}`, applicationJson);
		if (response.status === 200) {
			jobPost.value = response.data.data;
		}
	} catch (error) {
		console.error(error);
	} finally {
		isLoading.value = false;
	}
};

onMounted(() => {
	fetchJobBoardDetail();
});
</script>
