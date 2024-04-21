<template>
	<div class="item">
		<div class="info__wrap">
			<div class="item__fnc">
				<div class="list__item">
					<button type="button" class="list__item_button">
						<strong class="em">{{ jobBoard.company }}</strong>
						<em>{{ jobBoard.country }}</em>
						<em>{{ jobBoard.region }}</em>
					</button>
				</div>
			</div>
		</div>
		<div class="text__wrap">
			<button type="button" class="list__item_button" @click="onBoardDetail">
				<div class="text__item">
					<p class="title">{{ jobBoard.title }}</p>
					<p class="text">{{ jobBoard.content }}</p>
					<div class="tag__wrap">
						<div class="tag__inner">
							<!-- 필수 -->
							<div class="tag__item">
								<span class="item--tag">
									<em class="em">상시채용</em>
								</span>
								<span class="item--tag">
									<em class="em">{{ calculateDeadLine(jobBoard.deadline) }}</em>
								</span>
								<span class="item--tag">
									<em>경력(0년 이상)</em>
								</span>
								<span class="item--tag">
									<em>{{ jobBoard.experience }}</em>
								</span>
							</div>
							<!-- 선택 -->
							<!-- <div class="tag__item">
								<span class="item--tag">
									<em>대기업</em>
								</span>
								<span class="item--tag">
									<em>재택근무</em>
								</span>
							</div> -->
						</div>
					</div>
					<div class="tag__wrap">
						<div class="tag__inner">
							<div class="tag__item">
								<span class="item--hash" v-for="(tag, index) in jobBoard.tags" :key="index">
									<em>{{ tag }}</em>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div class="thumb" v-if="jobBoard.attachments.length > 0">
					<img :src="thumbnail" alt="" />
				</div>
			</button>
		</div>
		<div class="util__wrap">
			<div class="item__fnc">
				<p class="list__item read">
					<i class="blind">조회수</i>
					<span class="item__count">{{ jobBoard.viewCount }}</span>
				</p>
				<button type="button" class="list__item_button like" :class="{ active: isLiked }" @click="likePost">
					<!-- //활성화 .active -->
					<i class="blind">좋아요</i>
					<span class="item__count"> {{ jobBoard.likeCount }}</span>
				</button>
			</div>
			<div class="item__fnc">
				<p class="list__item past">
					<i class="blind">작성시간</i>
					<span class="item__count">
						{{ timeCalculation(jobBoard.createdAt.toString()).time
						}}{{ t(timeCalculation(jobBoard.createdAt.toString()).text) }}
					</span>
				</p>
				<button type="button" class="list__item_button mark" :class="{ active: isBookmarked }" @click="bookmarkApi">
					<!-- //활성화 .active -->
					<i class="blind">북마크</i>
				</button>
			</div>
		</div>
	</div>
	<!-- //.item -->
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { timeCalculation } from '@/utils/date-time.ts';
import { likeApi, viewApi, postBookmarkdApi } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';
import { IJobPost } from '@/types/interface';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const router = useRouter();

const props = defineProps({
	jobBoard: {
		type: Object as () => IJobPost,
		required: true,
		default: () => ({
			seq: 0,
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
});

const likes = ref(props.jobBoard.likeCount);
const likeUsers = ref(props.jobBoard.likeUsers);
const bookmarkUsers = ref(props.jobBoard.bookmarkUsers);
const userSeq = ref(userInfo.userSeq);
const thumbnail = ref(
	props.jobBoard.attachments.length > 0 ? props.jobBoard.attachments[0] : '',
);
const isLiked = computed(() => {
	return likeUsers.value.includes(userSeq.value ? userSeq.value : 0);
});

const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userSeq.value ? userSeq.value : 0);
});

const onBoardDetail = () => {
	viewApi(props.jobBoard.seq);
	router.push(`/board/${props.jobBoard.seq}`);
};

// 좋아요 API 호출
const likePost = () => {
	checkIfTokenExists();
	changeLike();
	likeApi('posts', props.jobBoard.seq);
};

const changeLike = () => {
	if (isLiked.value) {
		const index = likeUsers.value.indexOf(userSeq.value ? userSeq.value : 0);
		if (index !== -1) {
			likeUsers.value.splice(index, 1);
		}
		likes.value--;
	} else {
		likeUsers.value.push(userSeq.value ? userSeq.value : 0);
		likes.value++;
	}
};

const bookmarkApi = async () => {
	checkIfTokenExists();
	changeBookmark();
	try {
		postBookmarkdApi(props.jobBoard.seq);
	} catch (error) {
		console.log(error);
	}
};

const changeBookmark = () => {
	if (isBookmarked.value) {
		const index = bookmarkUsers.value.indexOf(userSeq.value ? userSeq.value : 0);
		if (index !== -1) {
			bookmarkUsers.value.splice(index, 1);
		}
	} else {
		bookmarkUsers.value.push(userSeq.value ? userSeq.value : 0);
	}
};

const checkIfTokenExists = () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
	}
};
const calculateDeadLine = (deadline: string | number | Date) => {
	const date = new Date(deadline);
	const now = new Date();
	const diff: number = date.getTime() - now.getTime();
	const day = 1000 * 60 * 60 * 24;
	const days = Math.floor(diff / day);
	return 'D-' + days;
};
</script>
