<template>
	<TheHeader />
	<div class="content">
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<BoardContent :jobPost="jobPost" :detail="true" :post="emptyPost" :isJobBoard="true" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import { applicationJson } from '@/utils/header';
import { IJobPost } from '@/types/interface';
import { emptyPost } from '@/utils/emptyObjects';
import api from '@/api';
import TheHeader from '@/components/layouts/TheHeader.vue';
import BoardContent from '@/components/board/BoardContent.vue';

const route = useRoute();
const postId = route.params.postId;

const jobPost = ref<IJobPost>({
	seq: 0,
	title: '',
	content: '',
	user: {
		seq: 0,
		nickName: '',
		email: '',
		profileImage: '',
		reportedCount: 0,
		reportedDate: '',
		country: '',
		interestCountry: '',
		region: '',
		userRole: '',
		userStatus: '',
	},
	viewCount: 0,
	likeCount: 0,
	tags: [],
	attachments: [],
	likeUsers: [],
	bookmarkUsers: [],
	country: '',
	region: '',
	industry: '',
	deadline: '',
	experience: '',
	salary: '',
	company: '',
	companyEmail: '',
	companyPhone: '',
	companyAddress: '',
	companyHomepage: '',
	companyLogo: '',
	status: '',
	createdAt: '',
})



const fetchJobBoardDetail = async () => {
	try {
		const response = await api.get(`/job-boards/${postId}`, applicationJson)
		if (response.status === 200) {
			jobPost.value = response.data.data
		}
	} catch (error) {
		console.error(error)
	}
}

onMounted(() => {
	fetchJobBoardDetail();
});
</script>
