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
								: !getUserProfileImage(),
						'image--default _company':
							boardType === boardTypeRef.JOBBOARD && !jobPost.companyLogo,
					}"
					@click="onUserProfileDetail"
				>
					<img
						v-if="
							boardType === boardTypeRef.JOBBOARD
								? jobPost.companyLogo
								: getUserProfileImage()
						"
						:src="
							boardType === boardTypeRef.JOBBOARD
								? jobPost.companyLogo
								: getUserProfileImage()
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
							<span
								v-if="boardType === boardTypeRef.POST && post.country"
								class="country-flag"
							>
								<span 
									v-if="!isCustomIcon(post.country)"
									:class="getFlagClass(post.country)"
									class="flag-icon"
								></span>
								<span 
									v-else-if="getCustomIconEmoji(post.country)"
									class="custom-icon flag-icon"
								>{{ getCustomIconEmoji(post.country) }}</span>
							</span>
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
							<span
								v-if="boardType === boardTypeRef.JOBBOARD && jobPost.country"
								class="country-flag"
							>
								<span 
									v-if="!isCustomIcon(jobPost.country)"
									:class="getFlagClass(jobPost.country)"
									class="flag-icon"
								></span>
								<span 
									v-else-if="getCustomIconEmoji(jobPost.country)"
									class="custom-icon flag-icon"
								>{{ getCustomIconEmoji(jobPost.country) }}</span>
							</span>
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
						<!-- Badge Icons -->
						<span 
							v-if="post.badge" 
							class="badge-icon" 
							:class="`badge--${post.badge?.toLowerCase()}`"
							@click="showBadgeTooltip = !showBadgeTooltip"
						></span>
						<!-- Badge Tooltip -->
						<div v-if="showBadgeTooltip && post.badge" class="badge-tooltip" @click="showBadgeTooltip = false">
							<div class="tooltip-content" @click.stop>
								<p class="tooltip-text">{{ getBadgeDescription(post.badge) }}</p>
							</div>
						</div>
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
import { useFlagStore } from '@/shared/stores/flag';

const { t } = useI18n();
const router = useRouter();
const userInfo = useUserInfoStore();
const flagStore = useFlagStore();

const boardTypeRef = BoardType;

// 안전한 번역 헬퍼 함수
const safeTranslate = (key: string, value: string) => {
	return value ? t(`${key}.${value}`) : '';
};

// 국기 정보 헬퍼 함수들
const getFlagClass = (countryCode: string): string => {
	return flagStore.getFlagClass(countryCode);
};

const isCustomIcon = (countryCode: string): boolean => {
	return flagStore.isCustomIcon(countryCode);
};

const getCustomIconEmoji = (countryCode: string): string => {
	return flagStore.getCustomIconEmoji(countryCode);
};

const isModalOpen = () => document.body.classList.add('inactive');
const isModalClose = () => document.body.classList.remove('inactive');

const userProfileDetailValue = ref(false);
const onUserProfileDetail = () => {
	// 본인 게시글이면 마이페이지로 이동
	if (props.post.userId === userInfo.userId) {
		router.push('/my-page');
		return;
	}
	
	// 다른 사람 게시글이면 프로필 디테일 모달 표시
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

const getUserProfileImage = (): string | null => {
	// post.userProfileUrl이 있으면 사용, 없으면 post.profileImage 확인
	return props.post.userProfileUrl || (props.post as any).profileImage || null;
};

const postAuthorInfo = ref<IOtherUserInfo>({
	userId: props.post.userId,
	userProfileUrl: getUserProfileImage(),
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

// Badge tooltip
const showBadgeTooltip = ref(false);

const getBadgeDescription = (badge: string): string => {
	switch (badge) {
		case 'MOST_VIEWED':
			return t('badge.mostViewed');
		case 'HOT':
			return t('badge.hot');
		default:
			return '';
	}
};

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

<style scoped>
.badge-icon {
	display: inline-block;
	width: 1.4rem;
	height: 1.4rem;
	margin-left: 1rem;
	vertical-align: middle;
	cursor: pointer;
	position: relative;
}

.badge--most_viewed {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23fbbf24' viewBox='0 0 16 16'%3e%3cpath d='M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'/%3e%3c/svg%3e");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
}

.badge--hot {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23ef4444' viewBox='0 0 16 16'%3e%3cpath d='M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15'/%3e%3c/svg%3e");
	background-size: contain;
	background-repeat: no-repeat;
	background-position: center;
	animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
	0% {
		opacity: 0.8;
		transform: scale(1);
	}
	100% {
		opacity: 1;
		transform: scale(1.1);
	}
}

.badge-tooltip {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: fadeIn 0.2s ease-out;
}

.tooltip-content {
	background: white;
	border-radius: 12px;
	padding: 1.5rem 2rem;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
	max-width: 300px;
	width: 90%;
	animation: slideUp 0.3s ease-out;
}

.tooltip-text {
	color: #333;
	font-size: 1.4rem;
	line-height: 1.5;
	margin: 0;
	text-align: center;
	word-break: keep-all;
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

</style>
