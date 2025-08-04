<template>
	<div class="board-detail-view" v-bind="$attrs">
		<div class="item">
			<div class="info__wrap">
				<button
					type="button"
					class="item__image"
					:class="{
						'image--default': isJobBoard
							? !jobPost.companyLogo
							: !post.userProfileUrl,
						'image--default _company': isJobBoard && !jobPost.companyLogo,
					}"
					@click="onUserProfileDetail"
				>
					<img
						v-if="isJobBoard ? jobPost.companyLogo : post.userProfileUrl"
						:src="isJobBoard ? jobPost.companyLogo : post.userProfileUrl"
						alt=""
						@click="isJobBoard ? null : onUserProfileDetail"
					/>
				</button>
				<div class="item__fnc" @click="onUserProfileDetail">
					<div class="list__item">
						<button type="button" class="list__item_button ctg">
							<em v-if="!isJobBoard">{{ t('countries.' + post.country) }}</em>
							<strong v-if="!isJobBoard">{{
								t('postCategories.' + post.category)
							}}</strong>
							<strong class="em" v-if="isJobBoard">{{
								jobPost.company
							}}</strong>
							<em v-if="isJobBoard">{{ t('countries.' + jobPost.country) }}</em>
							<em v-if="isJobBoard">{{ jobPost.region }}</em>
							<span
								v-if="!isJobBoard && post.isPublic === 'N'"
								class="list__private"
							>
								<i class="blind">내국가에만 공개 된 글</i>
							</span>
						</button>
					</div>
					<div class="list__item" v-if="!isJobBoard">
						<button type="button" class="list__item_button user">
							<em>{{ post.region }}</em>
							<strong>{{ post.userNickName }}</strong>
						</button>
					</div>
				</div>
				<div
					class="item__fnc"
					v-if="detail && post.userId == userInfo.userId"
					@click="onMoreModal"
				>
					<div class="list__item">
						<button type="button" class="list__item_button more">
							<i class="blind">더보기</i>
						</button>
					</div>
				</div>
			</div>
			<div class="text__wrap">
				<component
					:is="detail ? 'div' : 'button'"
					:class="detail ? 'list__item' : 'list__item_button'"
					@click="onBoardDetail"
				>
					<div class="text__item">
						<p class="title">{{ isJobBoard ? jobPost.title : post.title }}</p>
						<p class="text">
							{{ isJobBoard ? jobPost.content : post.content }}
						</p>
						<div class="tag__wrap" v-if="isJobBoard">
							<div class="tag__inner">
								<div class="tag__item">
									<span class="item--tag">
										<em class="em">상시채용</em>
									</span>
									<span class="item--tag">
										<em class="em">{{
											calculateDeadLine(jobPost.deadline)
										}}</em>
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
						<div
							class="tag__wrap"
							:class="detail ? '_detail' : ''"
							v-if="(isJobBoard ? jobPost : post).tags?.length > 0"
						>
							<div class="tag__inner">
								<div class="tag__item">
									<component
										v-for="(tag, index) in isJobBoard
											? jobPost.tags
											: post.tags"
										:key="index"
										class="item--hash"
										:is="detail ? 'button' : 'span'"
									>
										<em>{{ tag }}</em>
									</component>
								</div>
							</div>
						</div>
						<div
							class="attachments__wrap"
							v-if="
								detail &&
								(isJobBoard
									? jobPost.attachments.length > 0
									: post.attachments.length > 0)
							"
						>
							<div class="attachments__item">
								<div class="item__display">
									<div
										v-for="(attachment, index) in post.attachments"
										:key="index"
									>
										<img :src="attachment" alt="preview" />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						class="thumb"
						v-if="
							!isJobBoard &&
							!detail &&
							post.attachments &&
							post.attachments.length > 0
						"
					>
						<img :src="post.attachments[0]" alt="" />
					</div>
				</component>
			</div>
			<div class="util__wrap">
				<div class="item__fnc">
					<p class="list__item read">
						<i class="blind">조회수</i>
						<span class="item__count">{{ post.viewCount }}</span>
					</p>
					<button
						type="button"
						class="list__item_button like"
						:class="{ active: isLiked }"
						@click="likePost"
					>
						<i class="blind">좋아요</i>
						<span class="item__count">{{ likeCount }}</span>
					</button>
					<p class="list__item cmt" v-if="!isJobBoard">
						<i class="blind">댓글</i>
						<span class="item__count">{{
							post.comments ? post.comments.length : 0
						}}</span>
					</p>
				</div>
				<div class="item__fnc">
					<p class="list__item past">
						<i class="blind">작성시간</i>
						<span class="item__count">
							{{
								timeCalculation(
									isJobBoard ? jobPost.createdAt.toString() : post.createdAt,
								).time
							}}
							{{
								t(
									timeCalculation(
										isJobBoard ? jobPost.createdAt.toString() : post.createdAt,
									).text,
								)
							}}
						</span>
					</p>
					<button
						type="button"
						class="list__item_button mark"
						:class="{ active: isBookmarked }"
						@click="postBookmarkApi"
					>
						<i class="blind">북마크</i>
					</button>
				</div>
			</div>
		</div>
		<AdContent v-if="adValue" />
		<UserProfileDetail
			:userProfile="postAuthorInfo"
			@close="offUserProfileDetail"
			v-if="userProfileDetailValue"
		/>
		<MoreModalForPost
			v-if="moreModalValue"
			:posetSeq="post.postId"
			@close="closeMoreModal"
			@edit="editPost"
			@delete="deletePost"
		/>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/features/auth/stores/userInfo';
import { timeCalculation } from '@/shared/utils/date-time';
import { likeApi, postBookmark } from '@/features/board/services/post';
import { useI18n } from 'vue-i18n';
import type {
	IJobPost,
	IOtherUserInfo,
	IComment,
	IPost,
} from '@/shared/types/common';
import { AxiosResponse } from 'axios';
import { applicationJsonWithToken } from '@/shared/utils/header';
import UserProfileDetail from '@/features/board/components/UserProfileDetail.vue';
import AdContent from '@/features/board/components/AdContent.vue';
import MoreModalForPost from '@/shared/components/ui/MoreModalForPost.vue';
import api from '@/core/api/index';

const { t } = useI18n();
const router = useRouter();
const userInfo = useUserInfoStore();

const isModalOpen = () => document.body.classList.add('inactive');
const isModalClose = () => document.body.classList.remove('inactive');

const userProfileDetailValue = ref(false);
const onUserProfileDetail = () => {
	if (!postAuthorInfo.value.userId) setPostAuthorInfo();
	userProfileDetailValue.value = true;
	isModalOpen();
};
const offUserProfileDetail = () => {
	userProfileDetailValue.value = false;
	isModalClose();
};

const props = defineProps({
	post: {
		type: Object as () => IPost,
		required: true,
	},
	adValue: {
		type: Boolean,
		default: false,
	},
	detail: {
		type: Boolean,
		required: true,
		default: true,
	},
	isJobBoard: {
		type: Boolean,
		required: true,
		default: false,
	},
	jobPost: {
		type: Object as () => IJobPost,
		required: true,
	},
	postId: {
		type: String,
		default: '',
	},
});

const emits = defineEmits(['update:post']);

const jobPostValue = ref(props.isJobBoard);
const likeCount = computed(() => {
	return jobPostValue.value ? props.jobPost.likeCount : props.post.likeCount;
});
const likeUsers = ref(
	(jobPostValue.value ? props.jobPost.likeUsers : props.post.likeUsers) ?? [],
);
const bookmarkUsers = ref(
	(jobPostValue.value ? props.jobPost.bookmarkUsers : props.post.bookmarkUsers) ?? [],
);
const userSeq = ref(userInfo.userId);

const isLiked = computed(() => {
	const likeUsers = jobPostValue.value ? props.jobPost.likeUsers : props.post.likeUsers;
	return likeUsers?.includes(userSeq.value || '') ?? false;
});

const isBookmarked = computed(() =>
	bookmarkUsers.value?.includes(userSeq.value || '') ?? false,
);

const onBoardDetail = async () => {
	if (props.detail) return;

	await viewApi(
		jobPostValue.value ? props.jobPost.postId : props.post.postId,
		jobPostValue.value,
	);
	router.push(
		jobPostValue.value
			? `/job-board/${props.jobPost.postId}`
			: `/board/${props.post.postId}`,
	);
};

const viewApi = async (seq: any, jobPostFlag: boolean) => {
	try {
		const response = await api.post(
			jobPostFlag
				? `/api/jobboards/${seq}/views`
				: `/api/v1/posts/${seq}/views`,
		);
		if (response.status === 204) {
			// 업데이트된 조회수를 부모 컴포넌트에 전달
			const updatedPost = {
				...props.post,
				viewCount: (props.post.viewCount || 0) + 1,
			};
			emits('update:post', updatedPost);
		}
	} catch (error) {
		console.error(error);
		return { status: 'error', error };
	}
};

const likePost = () => {
	checkIfTokenExists();
	changeLike();
	likeApi(
		jobPostValue.value ? 'job-boards' : 'posts',
		jobPostValue.value ? props.jobPost.postId : props.post.postId,
	);
};

const changeLike = () => {
	const currentUserSeq = userSeq.value || 0;
	const targetPost = jobPostValue.value ? props.jobPost : props.post;

	if (isLiked.value) {
		targetPost.likeCount--;
		targetPost.likeUsers = targetPost.likeUsers.filter(
			id => id !== currentUserSeq,
		);
		likeUsers.value = targetPost.likeUsers;
	} else {
		targetPost.likeCount++;
		targetPost.likeUsers.push(currentUserSeq);
		likeUsers.value = targetPost.likeUsers;
	}
};

const postBookmarkApi = async () => {
	checkIfTokenExists();
	changeBookmark();
	try {
		await postBookmark(
			jobPostValue.value ? props.jobPost.postId : props.post.postId,
			jobPostValue.value ? 'JOB_BOARD' : 'POST',
		);
	} catch (error) {
		console.error(error);
	}
};

const changeBookmark = () => {
	if (isBookmarked.value) {
		const index = bookmarkUsers.value.indexOf(
			userSeq.value ? userSeq.value : 0,
		);
		if (index !== -1) bookmarkUsers.value.splice(index, 1);
	} else {
		if (userSeq.value !== null) bookmarkUsers.value.push(userSeq.value);
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
	if (!userInfo.accessToken) router.push('/sign-in');
};

const postAuthorInfo = ref<IOtherUserInfo>({
	userId: props.post.userId,
	userProfileUrl: props.post.userProfileUrl,
	userNickName: props.post.userNickName,
	country: props.post.country,
	region: props.post.region,
});

const setPostAuthorInfo = () => {
	postAuthorInfo.value = {
		userId: props.post.userId,
		userProfileUrl: props.post.userProfileUrl,
		userNickName: props.post.userNickName,
		country: props.post.country,
		region: props.post.region,
	};
};

const calculateDeadLine = (deadline: string | number | Date) => {
	const date = new Date(deadline);
	const now = new Date();
	const diff = date.getTime() - now.getTime();
	const day = 1000 * 60 * 60 * 24;
	const days = Math.floor(diff / day);
	return 'D-' + days;
};

const moreModalValue = ref(false);
const onMoreModal = () => {
	moreModalValue.value = true;
};
const closeMoreModal = () => {
	moreModalValue.value = false;
};

const editPost = () => {};

const deletePost = async () => {
	if (!props.isJobBoard) {
		try {
			const response: AxiosResponse<void> = await api.patch(
				`/posts/${props.post.postId}/delete`,
				{},
				applicationJsonWithToken(userInfo.accessToken),
			);
			if (response.status === 204) {
				router.push('/');
			}
		} catch (error) {
			console.error(error);
		}
	} else {
		try {
			const response: AxiosResponse<void> = await api.patch(
				`/job-boards/${props.jobPost.postId}/delete`,
				{},
				applicationJsonWithToken(userInfo.accessToken),
			);
			if (response.status === 204) {
				router.push('/');
			}
		} catch (error) {
			console.error(error);
		}
	}
};

// 코멘트를 생성일 기준으로 정렬하는 computed 속성
const sortedComments = computed(() => {
	return props.post.comments
		? props.post.comments.slice().sort((a, b) => {
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			})
		: [];
});
</script>
