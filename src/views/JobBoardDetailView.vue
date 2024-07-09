<template>
	<TheHeader />
	<div class="content">
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<BoardContent :jobBoard="jobBoard" :detail="true" :post="emptyPost" :isJobBoard="true" />
		</div>
	</div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/layouts/TheHeader.vue';
import BoardContent from '@/components/board/BoardContent.vue';
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import { applicationJson } from '@/utils/header';
import api from '@/api';
import { IJobPost } from '@/types/interface';
import { emptyPost } from '@/utils/emptyObjects';

const route = useRoute();
const postId = route.params.postId;

const jobBoard = ref<IJobPost>({
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
			jobBoard.value = response.data.data
		}
	} catch (error) {
		console.log(error)
	}
}

onMounted(() => {
	fetchJobBoardDetail();
});
</script>
