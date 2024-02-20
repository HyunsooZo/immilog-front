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
				<div class="list-wrap reply">
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
									<button type="button" class="list__item_button user">
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
								<button type="button" class="list__item_button like active">
									<!-- //활성화 .active -->
									<i class="blind">좋아요</i>
									<span class="item__count">{{
										detailPost.comments[commentIndex].upVotes
									}}</span>
								</button>
								<button type="button" class="list__item cmt" @click="openReplyWrite(commentIndex)">
									<span class="item__count">{{
										detailPost.comments[commentIndex].replies.length
									}}</span>
								</button>
								<p class="list__item past">
									<i class="blind">작성시간</i>
									<span class="item__count">{{
										timeCalculation(detailPost.comments[commentIndex].createdAt)
									}}</span>
								</p>
							</div>
						</div>
					</div>
					<!-- 대댓글 -->
					<div class="re--reply" v-for="reply in detailPost.comments[commentIndex].replies" :key="reply.seq">
						<div class="item">
							<div class="info__wrap">
								<div class="item__fnc">
									<div class="list__item">
										<button type="button" class="list__item_button user user--author">
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
											<span class="comment__user">{{
												reply.user.nickName
											}}</span>
											{{ reply.content }}
										</p>
									</div>
								</div>
							</div>
							<div class="util__wrap">
								<div class="item__fnc">
									<button type="button" class="list__item_button like">
										<!-- //활성화 .active -->
										<i class="blind">좋아요</i>
										<span class="item__count">{{ reply.upVotes }}</span>
									</button>
									<button type="button" class="list__item cmt" @click="openReplyWrite(index)">
										<!-- <span class="item__count"></span> -->
									</button>
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
				</div>
			</div>
		</div>
	</div>
	<ReplyWrite v-if="isReplyWriteClicked" :commentSeq="post.comments[commentIndex].seq" :isPostComment="false"
		@close="closeReplyWrite" />
</template>

<script setup>
import { ref } from 'vue';
import ReplyWrite from '@/components/ReplyWrite.vue';
import useAxios from '@/composables/useAxios';
import { timeCalculation, modalOpenClass, modalCloseClass } from '@/services/utils';

const { sendRequest } = useAxios();

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

const detailPost = props.post;
const isLiked = ref(false);

const emit = defineEmits(['close']);

const closeModal = () => {
	emit('close');
};

// 댓글쓰기
const isReplyWriteClicked = ref(false);
const replyIndex = ref();
const openReplyWrite = index => {
	replyIndex.value = index;
	isReplyWriteClicked.value = true;
	modalOpenClass();
};
const closeReplyWrite = () => {
	isReplyWriteClicked.value = false;
	modalCloseClass();
	setTimeout(() => {
		detailBoard();
	}, 1500);
};

const detailBoard = async () => {
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts/${props.postIndex}`,
			{
				header: {
					contentType: 'application/json',
				},
			},
		);
		if (status === 200) {
			detailPost.value = data.data;
			isLiked.value = data.data.likeUsers.some(user => user.seq === 1);
		}
	} catch (error) {
		console.log(error);
	}
};
</script>
