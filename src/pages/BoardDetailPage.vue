<template>
	<TheHeader />
	<div class="content">
		<!-- 글 상세 -->
		<div class="list-wrap">
			<div class="list__title">
				<span class="title">{{
					post.category ? t('postCategories.' + post.category) : ''
				}}</span>
			</div>
			<BoardContent
				:post="post"
				:detail="true"
				:jobPost="emptyJobPost"
				:isJobBoard="false"
			/>
		</div>
		<ReplyModal
			v-if="replyDetailModal"
			:post="post"
			:commentIndex="Number(replyIndex)"
			:postIndex="Number(postId)"
			@close="closeReplyModal"
		/>
		<!-- 댓글 기능버튼 -->
		<div class="fnc-wrap">
			<div class="button__list">
				<button
					type="button"
					class="button-icon__s button--post"
					@click="openCommentWrite"
				>
					<svg viewBox="0 0 16 16">
						<path :d="writeReply.first" />
						<path :d="writeReply.second" />
					</svg>
					<span>{{ t('boardDetailView.writeComment') }}</span>
				</button>
			</div>
			<div class="sort__list">
				<button
					type="button"
					class="button-icon__s last-reply"
					@click="goToDown"
				>
					<svg viewBox="0 0 16 16">
						<path :d="lastReply" />
					</svg>
					<span>{{ t('boardDetailView.seeLastComments') }}</span>
				</button>
			</div>
		</div>
		<!-- 댓글 -->
		<div class="list-wrap reply" v-if="post.comments.length === 0">
			<NoContent :item="'댓글'" />
		</div>
		<div
			class="list-wrap reply"
			v-for="(comment, index) in post.comments"
			:key="comment.commentId"
		>
			<div class="item">
				<div class="info__wrap">
					<div class="item__fnc">
						<div class="list__item">
							<button
								type="button"
								class="list__item_button user"
								:class="{ 'user--author': isAuthor(comment.user.userId) }"
								@click="onUserProfileDetail"
							>
								<em>{{ comment.user.country }}</em>
								<strong>{{ comment.user.nickname }}</strong>
							</button>
						</div>
					</div>
					<div class="item__fnc">
						<button type="button" class="list__item_button more">
							<i class="blind">더보기</i>
						</button>
					</div>
				</div>
				<div class="text__wrap">
					<div class="list__item">
						<div class="text__item">
							<p class="text">{{ comment.content }}</p>
						</div>
					</div>
				</div>
				<div class="util__wrap">
					<div class="item__fnc">
						<button
							type="button"
							class="list__item_button like"
							:class="{
								active: comment.likeUsers.includes(userId || ''),
							}"
							@click="likeComment(comment.commentId, index)"
						>
							<i class="blind">좋아요</i>
							<span class="item__count">{{ comment.upVotes }}</span>
						</button>
						<button
							type="button"
							class="list__item cmt"
							@click="openReplyWrite(index, null)"
						>
							<span class="item__count">{{ comment.replies.length }}</span>
						</button>
						<p class="list__item past">
							<i class="blind">작성시간</i>
							<span class="item__count">
								{{ timeCalculation(comment.createdAt).time
								}}{{ t(timeCalculation(comment.createdAt).text) }}
							</span>
						</p>
					</div>
				</div>
			</div>
			<!-- 대댓글 -->
			<div
				class="re--reply"
				v-for="(reply, replyIndex) in comment.replies.slice(0, 3)"
				:key="reply.commentId"
			>
				<div class="item">
					<div class="info__wrap">
						<div class="item__fnc">
							<div class="list__item">
								<button
									type="button"
									class="list__item_button user"
									:class="{ 'user--author': isAuthor(reply.user.userId) }"
									@click="onUserProfileDetail"
								>
									<em>{{ reply.user.country }}</em>
									<strong>{{ reply.user.nickname }}</strong>
								</button>
							</div>
						</div>
						<div class="item__fnc">
							<button type="button" class="list__item_button more">
								<i class="blind">더보기</i>
							</button>
						</div>
					</div>
					<div class="text__wrap">
						<div class="list__item">
							<div class="text__item">
								<p class="text">
									<span
										class="comment__user"
										v-if="extractAtWordAndRest(reply.content).atWord"
									>
										{{ extractAtWordAndRest(reply.content).atWord }}
									</span>
									{{ extractAtWordAndRest(reply.content).restText }}
								</p>
							</div>
						</div>
					</div>
					<div class="util__wrap">
						<div class="item__fnc">
							<button
								type="button"
								class="list__item_button like"
								:class="{
									active: post.comments[index].replies[
										replyIndex
									].likeUsers.includes(userId || ''),
								}"
								@click="likeReply(index, replyIndex)"
							>
								<i class="blind">좋아요</i>
								<span class="item__count">{{ reply.upVotes }}</span>
							</button>
							<button
								type="button"
								class="list__item cmt"
								@click="openReplyWrite(index, reply.user.nickname)"
							></button>
							<p class="list__item past">
								<i class="blind">작성시간</i>
								<span class="item__count">
									{{ timeCalculation(reply.createdAt).time
									}}{{ t(timeCalculation(reply.createdAt).text) }}
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<!-- n개 이상 대댓글 더보기 -->
			<div class="item item__more" v-if="comment.replyCount > 3">
				<button
					type="button"
					class="list__item_button button-text"
					@click="openReplyModal(index)"
				>
					<span
						>{{ comment.replyCount - 3
						}}{{ t('boardDetailView.multipleComments') }}</span
					>
				</button>
			</div>
		</div>
	</div>
	<ReplyWrite
		v-if="isCommentWriteClicked"
		:postId="post.postId"
		:isPostComment="true"
		@close="closeCommentWrite"
		@select:value="selectedValue"
	/>
	<ReplyWrite
		v-if="isReplyWriteClicked"
		:commentId="post.comments[Number(replyIndex)].commentId"
		:postId="post.postId"
		:isPostComment="false"
		:taggedUser="taggedUser"
		@close="closeReplyWrite"
		@select:value="selectedValue"
	/>
	<LoadingModal v-if="isLoading" />
	<UserProfileDetail
		:userProfile="postAuthorInfo"
		@close="offUserProfileDetail"
		v-if="isUserProfileDetailOn"
	/>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import type { IOtherUserInfo, IPost } from '@/shared/types/common';
import api from '@/core/api/index';
import { emptyJobPost } from '@/shared/utils/emptyObjects';
import { extractAtWordAndRest } from '@/shared/utils/comment';
import { likeApi, postBookmark } from '@/features/board/services/post';
import { lastReply, writeReply } from '@/shared/utils/icons';
import { timeCalculation } from '@/shared/utils/date-time';
import {
	applicationJson,
	applicationJsonWithToken,
} from '@/shared/utils/header';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import BoardContent from '@/features/board/components/BoardContent.vue';
import NoContent from '@/shared/components/ui/NoContent.vue';
import UserProfileDetail from '@/features/user/components/UserProfileDetail.vue';
import ReplyWrite from '@/features/board/components/ReplyWrite.vue';
import ReplyModal from '@/features/board/components/ReplyModal.vue';
import LoadingModal from '@/shared/components/ui/LoadingModal.vue';
import TheHeader from '@/shared/components/layout/TheHeader.vue';

const props = defineProps<{
	postId: string | number;
}>();

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const userInfo = useUserInfoStore();

// Modal control functions
const isModalOpen = () => {
	document.body.classList.add('inactive');
};
const isModalClose = () => {
	document.body.classList.remove('inactive');
};

// User profile detail modal
const isUserProfileDetailOn = ref(false);
const onUserProfileDetail = () => {
	if (post.value.userId === userInfo.userId) {
		router.push('/my-page');
	} else {
		isUserProfileDetailOn.value = true;
		isModalOpen();
	}
};
const offUserProfileDetail = () => {
	isUserProfileDetailOn.value = false;
	isModalClose();
};

// Check if user is the author
const isAuthor = (userIdParam: string) => {
	return userIdParam === post.value.userId;
};

// Loading state and reply modal control
const isLoading = ref(false);
const replyDetailModal = ref(false);
const replyIndex = ref<number | string>(0);
const openReplyModal = (index: number) => {
	replyIndex.value = index;
	replyDetailModal.value = true;
	isModalOpen();
};
const closeReplyModal = () => {
	replyDetailModal.value = false;
	isModalClose();
};

// Comment and reply write modals
const isReplyWriteClicked = ref(false);
const isCommentWriteClicked = ref(false);
const taggedUser = ref('');
const openReplyWrite = (index: number, nickname: string | null) => {
	replyIndex.value = index;
	isReplyWriteClicked.value = true;
	taggedUser.value = nickname ? nickname : '';
	isModalOpen();
};
const closeReplyWrite = () => {
	isReplyWriteClicked.value = false;
	taggedUser.value = '';
	isModalClose();
	setTimeout(() => {
		detailBoard();
	}, 1500);
};
const openCommentWrite = () => {
	isCommentWriteClicked.value = true;
	isModalOpen();
};
const closeCommentWrite = () => {
	isCommentWriteClicked.value = false;
	isModalClose();
	setTimeout(() => {
		detailBoard();
	}, 500);
};

// Post ID from route parameter (or props)
const postId = computed(() => route.params.postId || props.postId);

// Post data
const post = ref<IPost>({
	postId: '',
	title: '',
	content: '',
	userId: '',
	userProfileUrl: '',
	userNickname: '',
	comments: [],
	viewCount: 0,
	likeCount: 0,
	commentCount: 0,
	tags: [],
	attachments: [],
	likeUsers: [],
	bookmarkUsers: [],
	isPublic: '',
	country: '',
	region: '',
	status: '',
	category: '',
	createdAt: '',
});

// User and like/bookmark related states
const userId = ref<string>(userInfo.userId || '');
const likeUsers = ref(post.value.likeUsers);
const likeCount = ref(post.value.likeCount);
const bookmarkUsers = ref(post.value.bookmarkUsers);
const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userId.value || '');
});

// Like post function
const likePost = async () => {
	const currentUserId = userId.value;
	if (post.value.likeUsers.includes(currentUserId)) {
		post.value.likeCount--;
		const userIndex = post.value.likeUsers.indexOf(currentUserId);
		post.value.likeUsers.splice(userIndex, 1);
	} else {
		post.value.likeCount++;
		post.value.likeUsers.push(currentUserId);
	}
	// post.value를 재할당할 필요 없이 직접 수정하면 반응성이 유지됨
	const requestBody = {
		postId: post.value.postId,
		interactionType: 'LIKE',
		postType: 'POST',
	};
	const response = await api.post(
		'/api/interactions',
		requestBody,
		applicationJsonWithToken(userInfo.accessToken),
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 204) {
		console.error('좋아요 실패');
	}
};

// Like comment function
const likeComment = async (commentId: string, index: number) => {
	const updatedPost = JSON.parse(JSON.stringify(post.value));
	const comment = updatedPost.comments[index];
	if (comment.likeUsers.includes(userId.value)) {
		comment.upVotes--;
		const userIndex = comment.likeUsers.indexOf(userId.value);
		comment.likeUsers.splice(userIndex, 1);
	} else {
		comment.upVotes++;
		comment.likeUsers.push(userId.value);
	}
	post.value = updatedPost;

	const response = await likeApi(
		'comments',
		post.value.comments[index].commentId,
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 201) {
		console.error('좋아요 실패');
	}
};

// Like reply function
const likeReply = async (index: number, replyIdx: number) => {
	const updatedPost = JSON.parse(JSON.stringify(post.value));
	const comment = updatedPost.comments[index];
	const reply = comment.replies[replyIdx];
	if (reply.likeUsers.includes(userId.value)) {
		reply.upVotes--;
		const userIndex = reply.likeUsers.indexOf(userId.value);
		reply.likeUsers.splice(userIndex, 1);
	} else {
		reply.upVotes++;
		// 원래 코드의 기능을 그대로 유지 (오타 수정 없이)
		reply.likeUsers.push(userId.value);
	}
	post.value = updatedPost;

	const response = await likeApi(
		'replies',
		post.value.comments[index].replies[replyIdx].commentId,
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 201) {
		console.error('좋아요 실패');
	}
};

// Fetch post details
const detailBoard = async () => {
	try {
		const currentPostId = postId.value;
		if (!currentPostId) {
			console.error('Post ID is not defined');
			return;
		}
		const response = await api.get(
			`/api/v1/posts/${currentPostId}`,
			applicationJson,
		);
		if (response.status === 200) {
			post.value = {
				...response.data.post,
				comments: response.data.comments || [],
			};
			// 게시물 데이터 업데이트됨
			likeCount.value = response.data.post.likeCount;
			likeUsers.value = response.data.post.likeUsers;
			bookmarkUsers.value = response.data.post.bookmarkUsers;
		}
	} catch (error) {
		console.error(error);
	}
};

// Scroll to bottom function
const goToDown = () => {
	window.scrollTo(0, document.body.scrollHeight);
};

// More modal (관련 모달, 템플릿에서는 주석 처리되어 있음)
const onMorePostModal = ref(false);
const openMoreModal = () => {
	onMorePostModal.value = true;
};
const closeMoreModal = () => {
	onMorePostModal.value = false;
};

// Selected value for ReplyWrite component
const selectedValue = ref<any>(null);

const postAuthorInfo = ref<IOtherUserInfo>({
	userId: post.value.userId,
	nickname: post.value.userNickname,
	email: '',
	country: post.value.country,
	region: post.value.region,
	userProfileUrl: post.value.userProfileUrl,
});

// Bookmark API function
const bookmarkApi = async () => {
	checkIfTokenExists();
	changeBookmark();
	try {
		postBookmark(post.value.postId);
	} catch (error) {
		console.error(error);
	}
};

// Change bookmark state
const changeBookmark = () => {
	if (isBookmarked.value) {
		const index =
			userId.value !== null ? bookmarkUsers.value.indexOf(userId.value) : -1;
		if (index !== -1) {
			bookmarkUsers.value.splice(index, 1);
		}
	} else {
		if (userId.value !== null) {
			bookmarkUsers.value.push(userId.value);
		}
	}
};

// Check if token exists, else redirect to sign-in
const checkIfTokenExists = () => {
	if (!userInfo.accessToken) {
		router.push('/sign-in');
	}
};

// On component mount, verify token and fetch board details
onMounted(() => {
	if (!userInfo.accessToken) {
		router.push('/sign-in');
	}
	detailBoard();
});
</script>
