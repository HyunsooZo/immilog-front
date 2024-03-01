<template>
	<TheHeader />
	<div class="content">
		<!-- 글 상세 -->
		<div class="list-wrap">
			<div class="list__title">
				<span class="title">{{ post.category }}</span>
			</div>
			<div class="item">
				<div class="info__wrap">
					<div
						class="item__pic"
						:class="{ 'pic--default': !post.userProfileUrl }"
					>
						<img v-if="post.userProfileUrl" :src="post.userProfileUrl" alt="" />
					</div>
					<div class="item__fnc">
						<div class="list__item">
							<button type="button" class="list__item_button ctg">
								<em>{{ post.country }}</em>
								<strong>{{ post.category }}</strong>
							</button>
						</div>
						<div class="list__item">
							<button type="button" class="list__item_button user">
								<em>{{ post.region }}</em>
								<strong>{{ post.userNickName }}</strong></button
							><!-- //사용자 프로필 보기 > 채팅 -->
						</div>
					</div>
					<div class="item__fnc">
						<button type="button" class="list__item_button more">
							<i class="blind">더보기</i></button
						><!-- //공유, 신고, 본인글인 경우 추가 :수정, 삭제 -->
					</div>
				</div>
				<div class="text__wrap">
					<div class="list__item">
						<div class="text__item">
							<p class="title">{{ post.title }}</p>
							<p class="text">{{ post.content }}</p>
						</div>
					</div>
				</div>
				<!-- file preview -->
				<div class="attachments__wrap" v-if="post.attachments.length > 0">
					<div
						class="attachments__item"
						v-for="(image, index) in post.attachments"
						:key="index"
					>
						<div class="item__display">
							<img :src="image" alt="preview" />
						</div>
					</div>
					<!-- //loop -->
				</div>
				<div class="tag__wrap">
					<div class="tag__inner">
						<div class="tag__item">
							<button
								v-for="tag in post.tags"
								:key="tag"
								type="button"
								class="button button--hash"
							>
								<em>{{ tag }}</em>
							</button>
						</div>
					</div>
				</div>
				<div class="util__wrap">
					<div class="item__fnc">
						<button
							type="button"
							class="list__item_button like"
							:class="{ active: post.likeUsers.includes(userSeq) }"
							@click="likePost"
						>
							<i class="blind">좋아요</i>
							<span class="item__count">{{ post.likeCount }}</span>
						</button>
						<p class="list__item cmt">
							<i class="blind">댓글</i>
							<span class="item__count">{{ allCommentCounts(post) }}</span>
						</p>
					</div>
					<div class="item__fnc">
						<!-- <button type="button" class="list__item_button share">
							<i class="blind">공유하기</i>
						</button> -->
						<p class="list__item past">
							<i class="blind">작성시간</i>
							<span class="item__count">{{
								timeCalculation(post.createdAt)
							}}</span>
						</p>
						<button
							type="button"
							class="list__item_button mark"
							:class="{ active: isBookmarked }"
							@click="bookmarkApi"
						>
							<!-- //활성화 .active -->
							<i class="blind">북마크</i>
						</button>
					</div>
				</div>
			</div>
			<!-- //.item -->
		</div>
		<ReplyModal
			v-if="replyDetailModal"
			:post="post"
			:commentIndex="replyIndex"
			:postIndex="postSeq"
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
					<span>댓글쓰기</span>
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
					<span>마지막 댓글 보기</span>
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
			:key="comment.seq"
		>
			<!-- <div class="item item--blind"> -->
			<!-- 댓글 신고로 숨김처리 시 -->
			<!-- <div class="blind__text">
					<p class="text__item">신고에 의해 숨김처리 되었습니다.</p>
				</div> -->
			<!-- </div> -->
			<div class="item">
				<div class="info__wrap">
					<div class="item__fnc">
						<div class="list__item">
							<button
								type="button"
								class="list__item_button user"
								:class="{ 'user--author': isAuthor(comment.user.seq) }"
							>
								<!-- //원글작성자 댓글 .user--author -->
								<em>{{ comment.user.country }}</em>
								<strong>{{ comment.user.nickName }}</strong>
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
							:class="{ active: comment.likeUsers.includes(userSeq) }"
							@click="likeComment(comment.seq, index)"
						>
							<!-- //활성화 .active -->
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
							<span class="item__count">{{
								timeCalculation(comment.createdAt)
							}}</span>
						</p>
					</div>
				</div>
			</div>
			<!-- 대댓글 -->
			<div
				class="re--reply"
				v-for="(reply, replyIndex) in comment.replies.slice(0, 3)"
				:key="reply.seq"
			>
				<div class="item">
					<div class="info__wrap">
						<div class="item__fnc">
							<div class="list__item">
								<button
									type="button"
									class="list__item_button user"
									:class="{ 'user--author': isAuthor(reply.user.seq) }"
								>
									<!-- //원글작성자 댓글 .user--author -->
									<em>{{ reply.user.country }}</em>
									<strong>{{ reply.user.nickName }}</strong>
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
										>{{ extractAtWordAndRest(reply.content).atWord }}</span
									>
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
									active:
										post.comments[index].replies[replyIndex].likeUsers.includes(
											userSeq,
										),
								}"
								@click="likeReply(reply.seq, index, replyIndex)"
							>
								<!-- //활성화 .active -->
								<i class="blind">좋아요</i>
								<span class="item__count">{{ reply.upVotes }}</span>
							</button>
							<button
								type="button"
								class="list__item cmt"
								@click="openReplyWrite(index, reply.user.nickName)"
							></button>
							<p class="list__item past">
								<i class="blind">작성시간</i>
								<span class="item__count">
									{{ timeCalculation(reply.createdAt) }}
								</span>
							</p>
						</div>
					</div>
				</div>
				<!-- //.item -->
			</div>
			<!-- n개 이상 대댓글 더보기 -->
			<div class="item item__more" v-if="comment.replies.length > 3">
				<button
					type="button"
					class="list__item_button button-text"
					@click="openReplyModal(index)"
				>
					<span>{{ comment.replies.length - 3 }}개의 대댓글 보기</span>
				</button>
			</div>
		</div>
	</div>
	<!-- <SelectDialog v-if="isSortingSelectClicked" :title="selectTitle" :list="selectList" @close="closeSelect"
		@select:value="selectedValue" /> -->
	<ReplyWrite
		v-if="isCommentWriteClicked"
		:postSeq="post.seq"
		:isPostComment="true"
		@close="closeCommentWrite"
		@select:value="selectedValue"
	/>
	<ReplyWrite
		v-if="isReplyWriteClicked"
		:commentSeq="post.comments[replyIndex].seq"
		:isPostComment="false"
		:taggedUser="taggedUser"
		@close="closeReplyWrite"
		@select:value="selectedValue"
	/>
	<LoadingModal v-if="isLoading" />
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue';
import ReplyWrite from '@/components/comment/ReplyWrite.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAxios from '@/composables/useAxios.js';
import NoContent from '@/components/board/NoContent.vue';
import ReplyModal from '@/components/comment/ReplyModal.vue';
import LoadingModal from '@/components/loading/LoadingModal.vue';
import { useUserInfoStore } from '@/stores/userInfo';
import {
	timeCalculation,
	modalOpenClass,
	modalCloseClass,
} from '@/utils/date-time.js';
import { likeApi } from '@/services/post.js';
import { writeReply, lastReply } from '@/utils/icons';
import { extractAtWordAndRest } from '@/utils/comment.js';

const isAuthor = userSeq => {
	return userSeq === post.value.userSeq;
};
const router = useRouter();

const { sendRequest } = useAxios(router);

const route = useRoute();
const isLoading = ref(false);

const replyDetailModal = ref(false);

const openReplyModal = index => {
	replyIndex.value = index;
	replyDetailModal.value = true;
	modalOpenClass();
};

const closeReplyModal = () => {
	replyDetailModal.value = false;
	modalCloseClass();
};

// 댓글쓰기
const isReplyWriteClicked = ref(false);
const isCommentWriteClicked = ref(false);
const replyIndex = ref();
const taggedUser = ref('');
const openReplyWrite = (index, nickName) => {
	replyIndex.value = index;
	isReplyWriteClicked.value = true;
	taggedUser.value = nickName ? nickName : '';
	modalOpenClass();
};
const closeReplyWrite = () => {
	isReplyWriteClicked.value = false;
	taggedUser.value = '';
	modalCloseClass();
	setTimeout(() => {
		detailBoard();
	}, 1500);
};
const openCommentWrite = () => {
	isCommentWriteClicked.value = true;
	modalOpenClass();
};
const closeCommentWrite = () => {
	isCommentWriteClicked.value = false;
	modalCloseClass();
	setTimeout(() => {
		detailBoard();
	}, 1500);
};
const postSeq = route.params.postId;

const post = ref({
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
	bookmarkUsers: [],
	isPublic: '',
	country: '',
	region: '',
	status: '',
	category: '',
	createdAt: '',
});

const userInfo = useUserInfoStore();
const userSeq = ref(userInfo.userSeq);
const likeUsers = ref(post.value.likeUsers);
const likeCount = ref(post.value.likeCount);
const bookmarkUsers = ref(post.value.bookmarkUsers);
const token = localStorage.getItem('accessToken');

const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userSeq.value);
});

const likePost = async () => {
	const updatedPost = JSON.parse(JSON.stringify(post.value));
	if (updatedPost.likeUsers.includes(userSeq.value)) {
		updatedPost.likeCount--;
		const userIndex = updatedPost.likeUsers.indexOf(userSeq.value);
		updatedPost.likeUsers.splice(userIndex, 1);
	} else {
		updatedPost.likeCount++;
		updatedPost.likeUsers.push(userSeq.value);
	}
	post.value = updatedPost;

	const response = await likeApi('posts', post.value.seq, token);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 204) {
		console.log('좋아요 실패');
	}
};
const likeComment = async (seq, index) => {
	const updatedPost = JSON.parse(JSON.stringify(post.value));
	if (updatedPost.comments[index].likeUsers.includes(userSeq.value)) {
		updatedPost.comments[index].upVotes--;
		const userIndex = updatedPost.comments[index].likeUsers.indexOf(
			userSeq.value,
		);
		updatedPost.comments[index].likeUsers.splice(userIndex, 1);
	} else {
		updatedPost.comments[index].upVotes++;
		updatedPost.comments[index].likeUsers.push(userSeq.value);
	}

	// 반응형 시스템이 변경을 감지할 수 있도록 post 업데이트
	post.value = updatedPost;

	const response = await likeApi(
		'comments',
		post.value.comments[index].seq,
		token,
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 201) {
		console.log('좋아요 실패');
	}
};

const likeReply = async (seq, index, replyIndex) => {
	const updatedPost = JSON.parse(JSON.stringify(post.value));
	if (
		updatedPost.comments[index].replies[replyIndex].likeUsers.includes(
			userSeq.value,
		)
	) {
		updatedPost.comments[index].replies[replyIndex].upVotes--;
		const userIndex = updatedPost.comments[index].replies[
			replyIndex
		].likeUsers.indexOf(userSeq.value);
		updatedPost.comments[index].replies[replyIndex].likeUsers.splice(
			userIndex,
			1,
		);
	} else {
		updatedPost.comments[index].replies[replyIndex].upVotes++;
		updatedPost.comments[index].replies[replyIndex].likeUsers.push(
			userSeq.value,
		);
	}

	// 반응형 시스템이 변경을 감지할 수 있도록 post 업데이트
	post.value = updatedPost;
	const response = await likeApi(
		'replies',
		post.value.comments[index].replies[replyIndex].seq,
		token,
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 201) {
		console.log('좋아요 실패');
	}
};

const detailBoard = async () => {
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts/${route.params.postId}`,
			{
				headers: {
					contentType: 'application/json',
				},
			},
		);
		if (status === 200) {
			post.value = data.data;
			likeCount.value = data.data.likeCount;
			likeUsers.value = data.data.likeUsers;
			bookmarkUsers.value = data.data.bookmarkUsers;
		}
	} catch (error) {
		console.log(error);
	}
};

const goToDown = () => {
	window.scrollTo(0, document.body.scrollHeight);
};

const allCommentCounts = post => {
	let result = post.comments.length;
	post.comments.forEach(comment => {
		result += comment.replies.length;
	});
	return result;
};

onMounted(() => {
	detailBoard();
});
</script>
