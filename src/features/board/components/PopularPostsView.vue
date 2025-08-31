<template>
	<div class="popular-content">
		<!-- 주간 베스트 섹션 -->
		<div class="popular-section">
			<div class="section-header">
				<div class="section-badge best-badge">
					🏆 주간 베스트
				</div>
			</div>
			<div class="simple-post-list">
				<div 
					v-for="(post, index) in weeklyBestPosts.slice(0, 5)" 
					:key="`weekly-${post.postId}`"
					class="simple-post-item"
					@click="$router.push(`/post/${post.postId}`)"
				>
					<div class="rank-number" :class="`rank-${index + 1 <= 3 ? index + 1 : 'other'}`">
						{{ index + 1 }}
					</div>
					<div class="post-info">
						<h3 class="post-title">{{ post.title }}</h3>
						<p class="post-author">{{ post.nickname }}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- 구분선 -->
		<div class="section-divider"></div>

		<!-- HOT 글 섹션 -->
		<div class="popular-section">
			<div class="section-header">
				<div class="section-badge hot-badge">
					🔥 HOT 글
				</div>
			</div>
			<div class="simple-post-list">
				<div 
					v-for="(post, index) in hotPosts.slice(0, 5)" 
					:key="`hot-${post.postId}`"
					class="simple-post-item"
					@click="$router.push(`/post/${post.postId}`)"
				>
					<div class="rank-number" :class="`rank-${index + 1 <= 3 ? index + 1 : 'other'}`">
						{{ index + 1 }}
					</div>
					<div class="post-info">
						<h3 class="post-title">{{ post.title }}</h3>
						<p class="post-author">{{ post.nickname }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IPost } from '@/shared/types/common';
import { AxiosResponse } from 'axios';
import type { IApiPosts } from '@/features/board/types';
import api from '@/core/api/index';

interface Props {
	country?: string;
	category?: string;
}

const props = withDefaults(defineProps<Props>(), {
	country: 'ALL',
	category: 'ALL'
});

const weeklyBestPosts = ref<IPost[]>([]);
const hotPosts = ref<IPost[]>([]);

const fetchPopularPosts = async () => {
	try {
		// 주간 베스트 (좋아요 기준)
		const weeklyResponse: AxiosResponse<IApiPosts> = await api.get(
			`/api/v1/posts?country=${props.country}` +
				`&sort=LIKE_COUNT` +
				`&isPublic=Y` +
				`&category=${props.category}` +
				`&page=0&size=5`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		// HOT 글 (최근 인기 기준)
		const hotResponse: AxiosResponse<IApiPosts> = await api.get(
			`/api/v1/posts?country=${props.country}` +
				`&sort=LIKE_COUNT` +
				`&isPublic=Y` +
				`&category=${props.category}` +
				`&page=0&size=5`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (weeklyResponse.data.status === 200) {
			weeklyBestPosts.value = weeklyResponse.data.data.content;
		}

		if (hotResponse.data.status === 200) {
			hotPosts.value = hotResponse.data.data.content;
		}
	} catch (error) {
		console.error('Failed to fetch popular posts:', error);
	}
};

onMounted(() => {
	fetchPopularPosts();
});

defineExpose({
	fetchPopularPosts
});
</script>