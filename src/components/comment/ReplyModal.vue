<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<div class="item__fnc">
					<button type="button" class="button-icon button--back" role="link" @click="closeModal">
						<i class="blind">이전화면</i>
					</button>
				</div>
				<p class="modal-title"><em class="header-logo">KoMeet</em></p>
				<!-- <button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">닫기</i>
				</button> -->
			</div>
			<div class="modal-body">
				<div class="list-wrap reply" v-if="detailPost">
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
									<button type="button" class="list__item_button user" :class="{
										'user--author': isAuthor(
											detailPost.userSeq,
											detailPost.comments[commentIndex].user.seq,
										),
									}">
										<!-- //원글작성자 댓글 .user--author -->

										<em>{{
											detailPost.comments[commentIndex].user.country
										}}</em>
										<strong>{{
											detailPost.comments[commentIndex].user.nickName
										}}</strong>
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
										{{ detailPost.comments[commentIndex].content }}
									</p>
								</div>
							</div>
						</div>
						<div class="util__wrap">
							<div class="item__fnc">
								<button type="button" class="list__item_button like" :class="{
									active:
										detailPost.comments[commentIndex].likeUsers.includes(
											userSeq,
										),
								}" @click="likeComment(commentIndex)">
									<!-- //활성화 .active -->
									<i class="blind">좋아요</i>
									<span class="item__count">{{
										detailPost.comments[commentIndex].upVotes
									}}</span>
								</button>
								<button type="button" class="list__item cmt" @click="openReplyWrite(commentIndex, '')">
									<span class="item__count">{{
										detailPost.comments[commentIndex].replies.length
									}}</span>
								</button>
								<p class="list__item past">
									<i class="blind">작성시간</i>
									<span class="item__count">{{
										timeCalculation(
											detailPost.comments[commentIndex].createdAt,
										).time
									}}{{
											t(
												timeCalculation(
													detailPost.comments[commentIndex].createdAt,
												).text,
											)
										}}</span>
								</p>
							</div>
						</div>
					</div>
					<!-- 대댓글 -->
					<div class="re--reply" v-for="(reply, index) in detailPost.comments[commentIndex].replies" :key="reply.seq">
						<div class="item">
							<div class="info__wrap">
								<div class="item__fnc">
									<div class="list__item">
										<button type="button" class="list__item_button user" :class="{
											'user--author': isAuthor(
												detailPost.userSeq,
												reply.user.seq,
											),
										}">
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
											<span class="comment__user" v-if="extractAtWordAndRest(reply.content).atWord">{{
												extractAtWordAndRest(reply.content).atWord }}</span>
											{{ extractAtWordAndRest(reply.content).restText }}
										</p>
									</div>
								</div>
							</div>
							<div class="util__wrap">
								<div class="item__fnc">
									<button type="button" class="list__item_button like" :class="{
										active: reply.likeUsers.includes(userSeq),
									}" @click="likeReply(commentIndex, index)">
										<!-- //활성화 .active -->
										<i class="blind">좋아요</i>
										<span class="item__count">{{ reply.upVotes }}</span>
									</button>
									<button type="button" class="list__item cmt" @click="openReplyWrite(index, reply.user.nickName)">
										<!-- <span class="item__count"></span> -->
									</button>
									<p class="list__item past">
										<i class="blind">작성시간</i>
										<span class="item__count">
											{{ timeCalculation(reply.createdAt).time }}
											{{ t(timeCalculation(reply.createdAt).text) }}
										</span>
									</p>
								</div>
							</div>
						</div>
						<!-- //.item -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<ReplyWrite v-if="isReplyWriteClicked" :commentSeq="post.comments[commentIndex].seq" :isPostComment="false"
		:taggedUser="taggedUser" @close="closeReplyWrite" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ReplyWrite from '@/components/comment/ReplyWrite.vue';
import { timeCalculation } from '@/utils/date-time.ts';
import { useRouter } from 'vue-router';
import { extractAtWordAndRest } from '@/utils/comment.ts';
import { useUserInfoStore } from '@/stores/userInfo.ts';
import { likeApi } from '@/services/post.ts';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import { applicationJsonWithToken } from '@/utils/header';
import { AxiosResponse } from 'axios';
import { IApiPostDetail } from '@/types/api-interface';

const { t } = useI18n();

const userInfo = useUserInfoStore();

const userSeq = userInfo.userSeq;

const router = useRouter();

const props = defineProps({
	post: {
		type: Object,
		required: true,
	},
	commentIndex: {
		type: Number,
		required: true,
	},
	postIndex: {
		type: Number,
		required: true,
	},
});

const detailPost = ref();
const isLiked = ref(false);

const emit = defineEmits(['close']);

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

const closeModal = () => {
	emit('close');
};

// 댓글쓰기
const isReplyWriteClicked = ref(false);
const replyIndex = ref();
const taggedUser = ref();
const openReplyWrite = (index: number, nickName: string) => {
	taggedUser.value = nickName;
	replyIndex.value = index;
	isReplyWriteClicked.value = true;
	modalOpenClass();
};
const closeReplyWrite = () => {
	isReplyWriteClicked.value = false;
	modalCloseClass();
	setTimeout(() => {
		detailBoard();
	}, 500);
};

const detailBoard = async () => {
	try {
		const response: AxiosResponse<IApiPostDetail> = await axios.get(
			`/posts/${props.postIndex}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (response.status === 200) {
			detailPost.value = response.data.data;
			isLiked.value = response.data.data.likeUsers.some((userSeq: number) => userSeq === 1);
		}
	} catch (error) {
		console.log(error);
	}
};

const isAuthor = (postUserSeq: number, userSeq: number) => {
	return postUserSeq === userSeq;
};

const likeComment = async (index: number) => {
	const updatedPost = detailPost.value;
	if (updatedPost.comments[index].likeUsers.includes(userSeq)) {
		updatedPost.comments[index].upVotes--;
		const userIndex = updatedPost.comments[index].likeUsers.indexOf(userSeq);
		updatedPost.comments[index].likeUsers.splice(userIndex, 1);
	} else {
		updatedPost.comments[index].upVotes++;
		updatedPost.comments[index].likeUsers.push(userSeq);
	}

	// 반응형 시스템이 변경을 감지할 수 있도록 post 업데이트
	detailPost.value = updatedPost;

	const response = await likeApi(
		'comments',
		detailPost.value.comments[index].seq,
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 201) {
		console.log('좋아요 실패');
	}
};

const likeReply = async (index: number, replyIndex: number) => {
	const updatedPost = detailPost.value;
	if (
		updatedPost.comments[index].replies[replyIndex].likeUsers.includes(userSeq)
	) {
		updatedPost.comments[index].replies[replyIndex].upVotes--;
		const userIndex =
			updatedPost.comments[index].replies[replyIndex].likeUsers.indexOf(
				userSeq,
			);
		updatedPost.comments[index].replies[replyIndex].likeUsers.splice(
			userIndex,
			1,
		);
	} else {
		updatedPost.comments[index].replies[replyIndex].upVotes++;
		updatedPost.comments[index].replies[replyIndex].likeUsers.push(userSeq);
	}

	// 반응형 시스템이 변경을 감지할 수 있도록 post 업데이트
	detailPost.value = updatedPost;
	const response = await likeApi(
		'replies',
		detailPost.value.comments[index].replies[replyIndex].seq,
	);
	if (response.status === 401) {
		router.push('/sign-in');
	} else if (response.status !== 201) {
		console.log('좋아요 실패');
	}
};

onMounted(() => {
	detailPost.value = props.post;
});
</script>
