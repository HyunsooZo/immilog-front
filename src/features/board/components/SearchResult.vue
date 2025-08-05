<template>
	<div class="item">
		<div class="info__wrap">
			<div
				class="item__image"
				:class="{ 'image--default': !post.userProfileUrl }"
			>
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
					<button type="button" class="list__item_button user">
						<em>{{ post.region }}</em>
						<strong>{{ post.userNickname }}</strong>
					</button>
				</div>
			</div>
		</div>
		<div class="text__wrap">
			<button type="button" class="list__item_button" @click="onBoardDetail">
				<div class="text__item">
					<p
						class="title"
						v-html="highlightKeyword(post.title, post.keyword)"
					></p>
					<p
						class="text"
						v-html="highlightKeyword(post.content, post.keyword)"
					></p>
					<div class="tag__wrap">
						<div class="tag__inner">
							<div class="tag__item">
								<span class="item--hash" v-for="tag in post.tags" :key="tag">
									<em v-html="highlightKeyword(tag, post.keyword)"></em>
								</span>
							</div>
						</div>
					</div>
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
					<span class="item__count">{{ post.commentCounts }}</span>
				</p>
			</div>
			<div class="item__fnc">
				<p class="list__item past">
					<i class="blind">작성시간</i>
					<span class="item__count"
						>{{ timeCalculation(post.createdAt).time
						}}{{ t(timeCalculation(post.createdAt).text) }}</span
					>
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useUserInfoStore } from '@/features/user/stores/userInfo';
import { timeCalculation } from '@/shared/utils/date-time';
import { useI18n } from 'vue-i18n';
import type { ISearchResult } from '@/shared/types/common';
import { applicationJsonWithToken } from '@/shared/utils/header';
import { AxiosResponse } from 'axios';
import api from '@/core/api/index';

const { t } = useI18n();

const userInfo = useUserInfoStore();
const router = useRouter();

const props = defineProps({
	post: {
		type: Object as () => ISearchResult,
		required: true,
		default: () => ({
			postId: 0,
			title: '',
			content: '',
			userId: 0,
			userProfileUrl: '',
			userNickname: '',
			commentCounts: 0,
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
			keyword: '',
			createdAt: '',
		}),
	},
});

const emits = defineEmits(['update:post']);

const likes = ref(props.post.likeCount);
const likeUsers = ref(props.post.likeUsers);
const bookmarkUsers = ref(props.post.bookmarkUsers);
const userId = ref(userInfo.userId);
const thumbnail = ref(
	props.post.attachments.length > 0 ? props.post.attachments[0] : '',
);
const isLiked = computed(() => {
	return likeUsers.value.includes(userId.value || '');
});

const isBookmarked = computed(() => {
	return bookmarkUsers.value.includes(userId.value || '');
});

const onBoardDetail = () => {
	increaseViewCount();
	router.push(`/board/${props.post.postId}`);
};

const likeApi = async () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
		return;
	}
	changeLike();
	try {
		const response: AxiosResponse<void> = await api.post(
			`/posts/${props.post.postId}/like/users/${userId.value}`,
			{},
			applicationJsonWithToken(userInfo.accessToken),
		);
	} catch (error) {
		console.error(error);
	}
};

const increaseViewCount = async () => {
	try {
		const response: AxiosResponse<void> = await api.post(
			`/api/v1/posts/${props.post.postId}/views`,
			{},
			applicationJsonWithToken(userInfo.accessToken),
		);
		if (
			response.status === 200 ||
			response.status === 203 ||
			response.status === 204
		) {
			const updatedPost = {
				...props.post,
				viewCount: props.post.viewCount + 1,
			};
			emits('update:post', updatedPost);
		}
	} catch (error) {
		console.error(error);
	}
};

const changeLike = () => {
	if (isLiked.value) {
		const index = likeUsers.value.indexOf(userId.value || '');
		if (index !== -1) {
			likeUsers.value.splice(index, 1);
		}
		likes.value--;
	} else {
		likeUsers.value.push(userId.value || '');
		likes.value++;
	}
};

const bookmarkApi = async () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		router.push('/sign-in');
		return;
	}
	changeBookmark();
	try {
		await api.post(
			`/bookmarks/post/${props.post.postId}`,
			applicationJsonWithToken(userInfo.accessToken),
		);
	} catch (error) {
		console.error(error);
	}
};

const changeBookmark = () => {
	if (isBookmarked.value) {
		const index = bookmarkUsers.value.indexOf(userId.value || '');
		if (index !== -1) {
			bookmarkUsers.value.splice(index, 1);
		}
	} else {
		bookmarkUsers.value.push(userId.value || '');
	}
};

const highlightKeyword = (text: string, keyword: string): string => {
	if (!keyword) return text;
	const regex = new RegExp(`(${keyword})`, 'gi');
	return text.replace(
		regex,
		'<strong class="highlight"><span>$1</span></strong>',
	);
};
</script>
