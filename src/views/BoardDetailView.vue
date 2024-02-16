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
								<strong>{{ post.userNickname }}</strong></button
							><!-- //사용자 프로필 보기 > 채팅 -->
						</div>
					</div>
					<div class="item__fnc">
						<button type="button" class="list__item_button more">
							<i class="blind">더보기</i
							><!-- //공유, 신고, 글 수정/삭제(본인글인 경우) -->
						</button>
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
							:class="{ active: isLiked }"
							@click="likeApi"
						>
							<i class="blind">좋아요</i>
							<span class="item__count">{{ likeCount }}</span>
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
						<path
							d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
						/>
						<path
							d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
						/>
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
						<path
							d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"
						/>
					</svg>
					<span>마지막 댓글로 이동</span>
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
							<button type="button" class="list__item_button user">
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
						<button type="button" class="list__item_button like active">
							<!-- //활성화 .active -->
							<i class="blind">좋아요</i>
							<span class="item__count">{{ comment.upVotes }}</span>
						</button>
						<button
							type="button"
							class="list__item cmt"
							@click="openReplyWrite(index)"
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
				v-for="reply in comment.replies.slice(0, 3)"
				:key="reply.seq"
			>
				<div class="item">
					<div class="info__wrap">
						<div class="item__fnc">
							<div class="list__item">
								<button
									type="button"
									class="list__item_button user user--author"
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
									<span class="comment__user">{{ reply.user.nickName }}</span>
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
					<span>{{ comment.replies.length - 3 }}개의 대댓글 더 보기</span>
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
		@close="closeReplyWrite"
		@select:value="selectedValue"
	/>
	<LoadingModal v-if="isLoading" />
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue';
// import SelectDialog from '@/components/SelectDialog.vue';
import ReplyWrite from '@/components/ReplyWrite.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAxios from '@/composables/useAxios.js';
import NoContent from '@/components/NoContent.vue';
import ReplyModal from '@/components/ReplyModal.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import { useUserInfoStore } from '@/stores/userInfo';

const { sendRequest } = useAxios();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);

const replyDetailModal = ref(false);

const openReplyModal = index => {
	replyIndex.value = index;
	replyDetailModal.value = true;
};

const closeReplyModal = () => {
	replyDetailModal.value = false;
};

// 댓글쓰기
const isReplyWriteClicked = ref(false);
const isCommentWriteClicked = ref(false);
const replyIndex = ref();
const openReplyWrite = index => {
	replyIndex.value = index;
	isReplyWriteClicked.value = true;
	document.body.classList.add('inactive');
};
const closeReplyWrite = () => {
	isReplyWriteClicked.value = false;
	onLoading();
	document.body.classList.remove('inactive');
	setTimeout(() => {
		detailBoard();
	}, 1500);
};
const openCommentWrite = () => {
	isCommentWriteClicked.value = true;
	document.body.classList.add('inactive');
};
const closeCommentWrite = () => {
	isCommentWriteClicked.value = false;
	document.body.classList.remove('inactive');
	onLoading();
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

const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userSeq.value);
});
const isLiked = computed(() => {
	return likeUsers.value.includes(userSeq.value);
});

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

const likeApi = async () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
		return;
	}
	if (isLiked.value) {
		likeCount.value--;
	} else {
		likeCount.value++;
	}
	isLiked.value = !isLiked.value;

	try {
		await sendRequest('patch', `/posts/${postSeq}/like`, {
			header: {
				contentType: 'application/json',
				token: `Bearer ${token}`,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

const detailBoard = async () => {
	try {
		const { status, data } = await sendRequest(
			'get',
			`/posts/${route.params.postId}`,
			{
				header: {
					contentType: 'application/json',
				},
			},
		);
		if (status === 200) {
			post.value = data.data;
			isLiked.value = data.data.likeUsers.some(user => user.seq === 1);
			likeCount.value = data.data.likeCount;
			likeUsers.value = data.data.likeUsers;
			bookmarkUsers.value = data.data.bookmarkUsers;
		}
	} catch (error) {
		console.log(error);
	} finally {
		offLoading();
	}
};

const goToDown = () => {
	window.scrollTo(0, document.body.scrollHeight);
};

const onLoading = () => {
	isLoading.value = true;
};

const offLoading = () => {
	isLoading.value = false;
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
