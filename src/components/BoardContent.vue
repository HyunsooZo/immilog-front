<template>
	<div class="item">
		<div class="info__wrap">
			<div class="item__pic">
				<img :src="post.userProfileUrl" alt="" />
			</div>
			<div class="item-fnc">
				<div class="list__item">
					<button type="button" class="list__item_button ctg">
						<em>{{ post.country }}</em>
						<strong>{{ post.category }}</strong>
					</button>
				</div>
				<div class="list__item">
					<button type="button" class="list__item_button user">
						<strong>{{ post.userNickName }} ({{ post.region }})</strong>
					</button>
				</div>
			</div>
		</div>
		<div class="text__wrap">
			<button
				type="button"
				class="list__item_button"
				@click="onBoardDetail(post.seq)"
			>
				<p class="title">{{ post.title }}</p>
				<p class="text">{{ post.content }}</p>
			</button>
		</div>
		<div class="util__wrap">
			<div class="item-fnc">
				<p class="list__item read">
					<i class="blind">조회수</i>
					<span class="item__count">{{ post.viewCount }}</span>
				</p>
				<button
					type="button"
					class="list__item_button like"
					:class="{ active: isLiked }"
					@click="likeApi"
				>
					<!-- //활성화 .active -->
					<i class="blind">좋아요</i>
					<span class="item__count"> {{ likes }}</span>
				</button>
				<p class="list__item cmt">
					<i class="blind">댓글</i>
					<span class="item__count">{{ post.comments.length }}</span>
				</p>
			</div>
			<div class="item-fnc">
				<p class="list__item past">
					<i class="blind">작성시간</i>
					<span class="item__count">{{ timeCalculation(post.createdAt) }}</span>
				</p>
				<button type="button" class="list__item_button mark active">
					<!-- //활성화 .active -->
					<i class="blind">북마크</i>
				</button>
			</div>
		</div>
	</div>
	<!-- //.item -->
</template>

<script setup>
import { useRouter } from 'vue-router';
import useAxios from '@/composables/useAxios.js';
import { onMounted, ref, watchEffect } from 'vue';

const { sendRequest } = useAxios();

const router = useRouter();
const props = defineProps({
	post: {
		type: Object,
		required: true,
		default: () => ({
			seq: 0,
			title: '',
			content: '',
			userSeq: 0,
			userProfileUrl: '',
			userNickName: '',
			comments: [],
			viewCount: 0,
			likeCount: 0,
			tags: [],
			attachments: [],
			likeUsers: [],
			isPublic: '',
			country: '',
			region: '',
			status: '',
			category: '',
			createdAt: '',
		}),
	},
});

const likes = ref(props.post.likeCount);
const isLiked = ref();
const onBoardDetail = () => {
	increaseViewCount();
	router.push(`/board/${props.post.seq}`);
};

const timeCalculation = localTime => {
	// LocalDateTime 문자열을 JavaScript Date 객체로 변환
	const postDate = new Date(localTime);
	const now = new Date();
	const diff = now.getTime() - postDate.getTime();

	// 시간 차이를 분 단위로 변환
	const diffMinutes = Math.floor(diff / (1000 * 60));

	if (diffMinutes < 10) {
		return '방금 전';
	} else if (diffMinutes < 60) {
		return `${Math.ceil(diffMinutes / 10) * 10}분 전`;
	}

	// 시간 차이를 시간 단위로 변환
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}시간 전`;
	}

	// 하루 이상 차이 나는 경우 날짜 포맷으로 반환
	return postDate.toLocaleString('ko-KR', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};

watchEffect(() => {
	isLiked.value = props.post.likeUsers.includes(props.post.userSeq);
});

const likeApi = async () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
		return;
	}
	if (isLiked.value) {
		likes.value--;
	} else {
		likes.value++;
	}
	isLiked.value = !isLiked.value;

	try {
		await sendRequest('patch', `/posts/${props.post.seq}/like`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

const increaseViewCount = async () => {
	try {
		await sendRequest('patch', `/posts/${props.post.seq}/view`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

onMounted(() => {
	isLiked.value = props.post.likeUsers.includes(props.post.userSeq);
});
</script>
