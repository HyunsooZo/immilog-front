<template>
	<div class="item">
		<div class="info__wrap">
			<div class="item__fnc">
				<div class="list__item">
					<button type="button" class="list__item_button">
						<strong class="em">{{ jobPost.company }}</strong>
						<em>{{ jobPost.country }}</em>
						<em>{{ jobPost.region }}</em>
					</button>
				</div>
			</div>
		</div>
		<div class="text__wrap">
			<button type="button" class="list__item_button" @click="onBoardDetail">
				<div class="text__item">
					<p class="title">{{ jobPost.title }}</p>
					<p class="text">{{ jobPost.content }}</p>
					<div class="tag__wrap">
						<div class="tag__inner">
							<!-- 필수 -->
							<div class="tag__item">
								<span class="item--tag">
									<em class="em">상시채용</em>
								</span>
								<span class="item--tag">
									<em class="em">{{ calculateDeadLine(jobPost.deadline) }}</em>
								</span>
								<span class="item--tag">
									<em>경력(0년 이상)</em>
								</span>
								<span class="item--tag">
									<em>{{ jobPost.experience }}</em>
								</span>
							</div>
						</div>
					</div>
					<div class="tag__wrap">
						<div class="tag__inner">
							<div class="tag__item">
								<span
									class="item--hash"
									v-for="(tag, index) in jobPost.tags"
									:key="index"
								>
									<em>{{ tag }}</em>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="thumb" v-if="jobPost.attachments.length > 0">
					<img :src="thumbnail" alt="" />
				</div>
			</button>
		</div>
		<div class="util__wrap">
			<div class="item__fnc">
				<p class="list__item read">
					<i class="blind">조회수</i>
					<span class="item__count">{{ jobPost.viewCount }}</span>
				</p>
				<button
					type="button"
					class="list__item_button like"
					:class="{ active: isLiked }"
					@click="likePost"
				>
					<!-- //활성화 .active -->
					<i class="blind">좋아요</i>
					<span class="item__count"> {{ jobPost.likeCount }}</span>
				</button>
			</div>
			<div class="item__fnc">
				<p class="list__item past">
					<i class="blind">작성시간</i>
					<span class="item__count">
						{{ timeCalculation(jobPost.createdAt.toString()).time
						}}{{ t(timeCalculation(jobPost.createdAt.toString()).text) }}
					</span>
				</p>
				<button
					type="button"
					class="list__item_button mark"
					:class="{ active: isBookmarked }"
					@click="postBokmarkApi"
				>
					<!-- //활성화 .active -->
					<i class="blind">북마크</i>
				</button>
			</div>
		</div>
	</div>
	<!-- //.item -->
	<AdContent v-if="showAd" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { timeCalculation } from '@/shared/utils/date-time';
import { likeApi, postBookmark } from '@/features/board/services/post';
import { useI18n } from 'vue-i18n';
import type { IJobPost } from '@/shared/types/common';
import AdContent from './AdContent.vue';
import api from '@/core/api/index';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const router = useRouter();

const props = defineProps({
	jobPost: {
		type: Object as () => IJobPost,
		required: true,
		default: () => ({
			postId: 0,
			title: '',
			content: '',
			userDto: {},
			viewCount: 0,
			likeCount: 0,
			tags: [],
			attachments: [],
			likeUsers: [],
			bookmarkUsers: [],
			country: '',
			region: '',
			Industry: '',
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
		}),
	},
	showAd: {
		type: Boolean,
		default: false,
	},
});

const likes = ref(props.jobPost.likeCount);
const likeUsers = ref(props.jobPost.likeUsers);
const bookmarkUsers = ref(props.jobPost.bookmarkUsers);
const userSeq = ref(userInfo.userId);
const thumbnail = ref(
	props.jobPost.attachments.length > 0 ? props.jobPost.attachments[0] : '',
);
const isLiked = computed(() => {
	return likeUsers.value.includes(userSeq.value || '');
});

const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userSeq.value || '');
});

// 게시글 상세 페이지로 이동
const onBoardDetail = async () => {
	await viewApi(props.jobPost.postId, true);
	router.push(`/board/${props.jobPost.postId}`);
};

const viewApi = async (seq: any, jobPostFlag: boolean) => {
	try {
		const response = await api.post(
			jobPostFlag
				? `/api/jobboards/${seq}/views`
				: `/api/v1/posts/${seq}/views`,
		);
		return { status: response.status };
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};

// 좋아요 API 호출
const likePost = () => {
	checkIfTokenExists();
	changeLikeStatus();
	likeApi('posts', props.jobPost.postId);
};

// 좋아요 상태 변경
const changeLikeStatus = () => {
	if (isLiked.value) {
		const index = likeUsers.value.indexOf(userSeq.value || '');
		if (index !== -1) {
			likeUsers.value.splice(index, 1);
		}
		likes.value--;
	} else {
		likeUsers.value.push(userSeq.value || '');
		likes.value++;
	}
};

// 북마크 API 호출
const postBokmarkApi = async () => {
	checkIfTokenExists();
	changeBookmarkStatus();
	try {
		postBookmark(props.jobPost.postId, 'JOB_BOARD');
	} catch (error) {
		console.error(error);
	}
};

// 북마크 상태 변경
const changeBookmarkStatus = () => {
	if (isBookmarked.value) {
		const index = bookmarkUsers.value.indexOf(
			userSeq.value ? userSeq.value : 0,
		);
		if (index !== -1) {
			bookmarkUsers.value.splice(index, 1);
		}
	} else {
		bookmarkUsers.value.push(userSeq.value || '');
	}
};

// 토큰 존재 여부 확인
const checkIfTokenExists = () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
	}
};

// D-day 계산
const calculateDeadLine = (deadline: string | number | Date) => {
	const date = new Date(deadline);
	const now = new Date();
	const diff: number = date.getTime() - now.getTime();
	const day = 1000 * 60 * 60 * 24;
	const days = Math.floor(diff / day);
	return 'D-' + days;
};
</script>
