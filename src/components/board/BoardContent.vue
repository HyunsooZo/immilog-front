<template>
	<div class="item">
		<div class="info__wrap">
			<div class="item__pic" :class="{ 'pic--default': !post.userProfileUrl }">
				<img v-if="post.userProfileUrl" :src="post.userProfileUrl" alt="" />
			</div>
			<div class="item__fnc">
				<div class="list__item">
					<button type="button" class="list__item_button ctg">
						<em>{{ post.country }}</em>
						<strong>{{ post.category }}</strong>
						<span v-if="post.isPublic === 'N'" class="list__private">
							<i class="blind">내국가에만 공개 된 글</i>
						</span>
					</button>
				</div>
				<div class="list__item">
					<button type="button" class="list__item_button user" @click="onUserProfileDetail">
						<em>{{ post.region }}</em>
						<strong>{{ post.userNickName }}</strong>
					</button>
				</div>
			</div>
		</div>
		<div class="text__wrap">
			<button type="button" class="list__item_button" @click="onBoardDetail()">
				<div class="text__item">
					<p class="title">{{ post.title }}</p>
					<p class="text">{{ post.content }}</p>
				</div>
				<div class="thumb" v-if="post.attachments.length > 0">
					<img :src="thumbnail" alt="" />
				</div>
			</button>
		</div>
		<div class="util__wrap">
			<div class="item__fnc">
				<p class="list__item read">
					<i class="blind">조회수</i>
					<span class="item__count">{{ post.viewCount }}</span>
				</p>
				<button type="button" class="list__item_button like" :class="{ active: isLiked }" @click="likePost">
					<!-- //활성화 .active -->
					<i class="blind">좋아요</i>
					<span class="item__count"> {{ likes }}</span>
				</button>
				<p class="list__item cmt">
					<i class="blind">댓글</i>
					<span class="item__count">{{ allCommentCounts(post) }}</span>
				</p>
			</div>
			<div class="item__fnc">
				<p class="list__item past">
					<i class="blind">작성시간</i>
					<span class="item__count">{{ timeCalculation(post.createdAt).time
						}}{{ t(timeCalculation(post.createdAt).text) }}</span>
				</p>
				<button type="button" class="list__item_button mark" :class="{ active: isBookmarked }" @click="bookmarkApi">
					<!-- //활성화 .active -->
					<i class="blind">북마크</i>
				</button>
			</div>
		</div>
	</div>
	<!-- //.item -->
	<AdContent v-if="showAd" />
	<UserProfileDetail @close="offUserProfileDetail" v-if="isUserProfileDetailOn" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { timeCalculation } from '@/utils/date-time.ts';
import { likeApi, viewApi, postBookmarkdApi } from '@/services/post.ts';
import AdContent from '@/components/board/AdContent.vue';
import UserProfileDetail from '@/components/board/UserProfileDetail.vue';
import { useI18n } from 'vue-i18n';
import type { IComment, IPost } from '@/types/api-interface';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const router = useRouter();

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};
// 프로필 보기
const isUserProfileDetailOn = ref(false);
const onUserProfileDetail = () => {
	isUserProfileDetailOn.value = true;
	modalOpenClass();
};
const offUserProfileDetail = () => {
	isUserProfileDetailOn.value = false;
	modalCloseClass();
};

const props = defineProps({
	post: {
		type: Object as () => IPost,
		required: true
	},
	showAd: {
		type: Boolean,
		default: false
	},
});

const likes = ref(props.post.likeCount);
const likeUsers = ref(props.post.likeUsers);
const bookmarkUsers = ref(props.post.bookmarkUsers);
const userSeq = ref(userInfo.userSeq);
const thumbnail = ref(
	props.post.attachments.length > 0 ? props.post.attachments[0] : '',
);
const isLiked = computed(() => {
	return likeUsers.value.includes(userSeq.value ? userSeq.value : 0);
});

const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userSeq.value ? userSeq.value : 0);
});

const onBoardDetail = () => {
	viewApi(props.post.seq);
	router.push(`/board/${props.post.seq}`);
};

// 좋아요 API 호출
const likePost = () => {
	checkIfTokenExists();
	changeLike();
	likeApi('posts', props.post.seq);
};

const changeLike = () => {
	if (isLiked.value) {
		const index = likeUsers.value.indexOf(userSeq.value ? userSeq.value : 0);
		if (index !== -1) {
			likeUsers.value.splice(index, 1);
		}
		likes.value--;
	} else {
		if (userSeq.value !== null) {
			likeUsers.value.push(userSeq.value);
		}
		likes.value++;
	}
};

const bookmarkApi = async () => {
	checkIfTokenExists();
	changeBookmark();
	try {
		postBookmarkdApi(props.post.seq);
	} catch (error) {
		console.log(error);
	}
};

const changeBookmark = () => {
	if (isBookmarked.value) {
		const index = userSeq.value !== null ? bookmarkUsers.value.indexOf(userSeq.value) : -1;
		if (index !== -1) {
			bookmarkUsers.value.splice(index, 1);
		}
	} else {
		if (userSeq.value !== null) {
			bookmarkUsers.value.push(userSeq.value);
		}
	}
};

const allCommentCounts = (post: IPost) => {
	let result = post.comments.length;
	post.comments.forEach((comment: IComment) => {
		result += comment.replies.length;
	});
	return result;
};

const checkIfTokenExists = () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
	}
};
</script>
