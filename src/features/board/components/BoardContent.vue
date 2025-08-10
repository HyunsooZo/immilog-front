<template>
	<div class="board-detail-view" v-bind="$attrs">
		<div class="item">
			<div class="info__wrap">
				<button
					type="button"
					class="item__image"
					:class="{
						'image--default':
							boardType === boardTypeRef.JOBBOARD
								? !jobPost.companyLogo
								: !post.userProfileUrl,
						'image--default _company':
							boardType === boardTypeRef.JOBBOARD && !jobPost.companyLogo,
					}"
					@click="onUserProfileDetail"
				>
					<img
						v-if="
							boardType === boardTypeRef.JOBBOARD
								? jobPost.companyLogo
								: post.userProfileUrl
						"
						:src="
							boardType === boardTypeRef.JOBBOARD
								? jobPost.companyLogo
								: post.userProfileUrl
						"
						alt=""
						@click="
							boardType === boardTypeRef.JOBBOARD ? null : onUserProfileDetail
						"
					/>
				</button>
				<div class="item__fnc" @click="onUserProfileDetail">
					<div class="list__item">
						<button type="button" class="list__item_button ctg">
							<em
								v-if="
									boardType === boardTypeRef.POST &&
									safeTranslate('countries', post.country)
								"
								>{{ safeTranslate('countries', post.country) }}</em
							>
							<strong
								v-if="
									boardType === boardTypeRef.POST &&
									safeTranslate('postCategories', post.category)
								"
								>{{ safeTranslate('postCategories', post.category) }}</strong
							>
							<strong class="em" v-if="boardType === boardTypeRef.JOBBOARD">{{
								jobPost.company
							}}</strong>
							<em
								v-if="
									boardType === boardTypeRef.JOBBOARD &&
									safeTranslate('countries', jobPost.country)
								"
								>{{ safeTranslate('countries', jobPost.country) }}</em
							>
							<em v-if="boardType === boardTypeRef.JOBBOARD">{{
								jobPost.region
							}}</em>
							<span
								v-if="boardType === boardTypeRef.POST && post.isPublic === 'N'"
								class="list__private"
							>
								<i class="blind">내국가에만 공개 된 글</i>
							</span>
						</button>
					</div>
					<div class="list__item" v-if="boardType === boardTypeRef.POST">
						<button type="button" class="list__item_button user">
							<em>{{ post.region }}</em>
							<strong>{{ post.userNickname }}</strong>
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
						<p class="title">
							{{
								boardType === boardTypeRef.JOBBOARD ? jobPost.title : post.title
							}}
						</p>
						<p class="text">
							{{
								boardType === boardTypeRef.JOBBOARD
									? jobPost.content
									: post.content
							}}
						</p>
						<div class="tag__wrap" v-if="boardType === boardTypeRef.JOBBOARD">
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
							v-if="
								(boardType === boardTypeRef.JOBBOARD ? jobPost : post).tags
									?.length > 0
							"
						>
							<div class="tag__inner">
								<div class="tag__item">
									<component
										v-for="(tag, index) in boardType === boardTypeRef.JOBBOARD
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
								(boardType === boardTypeRef.JOBBOARD
									? jobPost.attachments?.length > 0
									: post.attachments?.length > 0)
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
							boardType === boardTypeRef.POST &&
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
					<p class="list__item cmt" v-if="boardType === boardTypeRef.POST">
						<i class="blind">댓글</i>
						<span class="item__count">{{ post.commentCount }}</span>
					</p>
				</div>
				<div class="item__fnc">
					<p class="list__item past">
						<i class="blind">작성시간</i>
						<span class="item__count">
							{{
								timeCalculation(
									boardType === boardTypeRef.JOBBOARD
										? jobPost.createdAt.toString()
										: post.createdAt,
								).time
							}}
							{{
								t(
									timeCalculation(
										boardType === boardTypeRef.JOBBOARD
											? jobPost.createdAt.toString()
											: post.createdAt,
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
			:postId="post.postId"
			@close="closeMoreModal"
			@edit="editPost"
			@delete="deletePost"
		/>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { timeCalculation } from '@/shared/utils/date-time';
import { likeApi, postBookmark } from '@/features/board/services/post';
import { useI18n } from 'vue-i18n';
import type { IJobPost, IOtherUserInfo, IPost } from '@/shared/types/common';
import { BoardType } from '@/shared/types/common';
import { AxiosResponse } from 'axios';
import { applicationJsonWithToken } from '@/shared/utils/header';
import UserProfileDetail from '@/features/user/components/UserProfileDetail.vue';
import AdContent from '@/features/board/components/AdContent.vue';
import MoreModalForPost from '@/shared/components/ui/MoreModalForPost.vue';
import api from '@/core/api/index';

const { t } = useI18n();
const router = useRouter();
const userInfo = useUserInfoStore();

const boardTypeRef = BoardType;

// 안전한 번역 헬퍼 함수
const safeTranslate = (key: string, value: string) => {
	return value ? t(`${key}.${value}`) : '';
};

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
	boardType: {
		type: String as () => BoardType,
		required: true,
		default: BoardType.POST,
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

const isJobBoard = computed(() => props.boardType === boardTypeRef.JOBBOARD);
const likeCount = computed(() => {
	return isJobBoard.value ? props.jobPost.likeCount : props.post.likeCount;
});
const likeUsers = ref(
	(isJobBoard.value ? props.jobPost.likeUsers : props.post.likeUsers) ?? [],
);
const bookmarkUsers = computed(() =>
	(isJobBoard.value ? props.jobPost.bookmarkUsers : props.post.bookmarkUsers) ??
		[],
);
const userId = ref(userInfo.userId);

const isLiked = computed(() => {
	const likeUsers = isJobBoard.value
		? props.jobPost.likeUsers
		: props.post.likeUsers;
	return likeUsers?.includes(userId.value || '') ?? false;
});

const isBookmarked = computed(
	() => bookmarkUsers.value?.includes(userId.value || '') ?? false,
);

const onBoardDetail = async () => {
	if (props.detail) return;

	await viewApi(
		String(isJobBoard.value ? props.jobPost.postId : props.post.postId),
		isJobBoard.value,
	);
	router.push(
		isJobBoard.value
			? `/job-board/${props.jobPost.postId}`
			: `/board/${props.post.postId}`,
	);
};

const viewApi = async (id: string, jobPostFlag: boolean) => {
	try {
		const response = await api.post(
			jobPostFlag ? `/api/jobboards/${id}/views` : `/api/v1/posts/${id}/views`,
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
		isJobBoard.value ? 'job-boards' : 'posts',
		String(isJobBoard.value ? props.jobPost.postId : props.post.postId),
	);
};

const changeLike = () => {
	const currentUserId = userId.value || '';
	const targetPost = isJobBoard.value ? props.jobPost : props.post;

	if (isLiked.value) {
		targetPost.likeCount--;
		targetPost.likeUsers = targetPost.likeUsers.filter(
			id => id !== currentUserId,
		);
		likeUsers.value = targetPost.likeUsers;
	} else {
		targetPost.likeCount++;
		targetPost.likeUsers.push(currentUserId);
		likeUsers.value = targetPost.likeUsers;
	}
};

const postBookmarkApi = async () => {
	checkIfTokenExists();
	changeBookmark();
	try {
		await postBookmark(
			String(isJobBoard.value ? props.jobPost.postId : props.post.postId),
		);
	} catch (error) {
		console.error(error);
	}
};

const changeBookmark = () => {
	const targetPost = isJobBoard.value ? props.jobPost : props.post;
	const currentUserId = userId.value || '';
	
	if (isBookmarked.value) {
		const index = targetPost.bookmarkUsers.indexOf(currentUserId);
		if (index !== -1) targetPost.bookmarkUsers.splice(index, 1);
	} else {
		if (userId.value !== null) targetPost.bookmarkUsers.push(currentUserId);
	}
};

const checkIfTokenExists = () => {
	if (!userInfo.accessToken) router.push('/sign-in');
};

const postAuthorInfo = ref<IOtherUserInfo>({
	userId: props.post.userId,
	userProfileUrl: props.post.userProfileUrl,
	nickname: props.post.userNickname,
	email: '',
	country: props.post.country,
	region: props.post.region,
});

const setPostAuthorInfo = () => {
	postAuthorInfo.value = {
		userId: props.post.userId,
		userProfileUrl: props.post.userProfileUrl,
		nickname: props.post.userNickname,
		email: '',
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
	if (props.boardType === BoardType.POST) {
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
</script>
