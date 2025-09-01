<template>
	<div class="popular-content">
		<!-- 주간 베스트 섹션 -->
		<div class="popular-section">
			<div class="section-header">
				<div class="section-badge best-badge">
					🏆 {{ t('homeView.weeklyBest') }}
				</div>
			</div>
			<div class="simple-post-list">
				<div 
					v-for="(post, index) in weeklyBestPosts.slice(0, 5)" 
					:key="`weekly-${post.postId}`"
					class="simple-post-item"
					@click="$router.push(`/board/${post.postId}`)"
				>
					<div class="rank-number" :class="`rank-${index + 1 <= 3 ? index + 1 : 'other'}`">
						{{ index + 1 }}
					</div>
					<div class="post-info">
						<h3 class="post-title">{{ post.title }}</h3>
						<div class="post-author">
							<span 
								v-if="!isCustomIcon(post.country)"
								:class="getFlagClass(post.country)"
								class="flag-icon medium"
							></span>
							<span 
								v-else-if="getCustomIconEmoji(post.country)"
								class="custom-icon flag-icon medium"
							>{{ getCustomIconEmoji(post.country) }}</span>
							{{ post.userNickname || '익명' }}
						</div>
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
					🔥 {{ t('homeView.hotPosts') }}
				</div>
			</div>
			<div class="simple-post-list">
				<div 
					v-for="(post, index) in hotPosts.slice(0, 5)" 
					:key="`hot-${post.postId}`"
					class="simple-post-item"
					@click="$router.push(`/board/${post.postId}`)"
				>
					<div class="rank-number" :class="`rank-${index + 1 <= 3 ? index + 1 : 'other'}`">
						{{ index + 1 }}
					</div>
					<div class="post-info">
						<h3 class="post-title">{{ post.title }}</h3>
						<div class="post-author">
							<span 
								v-if="!isCustomIcon(post.country)"
								:class="getFlagClass(post.country)"
								class="flag-icon medium"
							></span>
							<span 
								v-else-if="getCustomIconEmoji(post.country)"
								class="custom-icon flag-icon medium"
							>{{ getCustomIconEmoji(post.country) }}</span>
							{{ post.userNickname || '익명' }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IPost } from '@/shared/types/common';
import { getPopularPostsApi } from '@/features/board/services/post';
import { useI18n } from 'vue-i18n';
import { useFlagStore } from '@/shared/stores/flag';

interface Props {
	country?: string;
	category?: string;
}

const { t } = useI18n();
const flagStore = useFlagStore();

const props = withDefaults(defineProps<Props>(), {
	country: 'ALL',
	category: 'ALL'
});

const weeklyBestPosts = ref<IPost[]>([]);
const hotPosts = ref<IPost[]>([]);

const fetchPopularPosts = async () => {
	try {
		const response = await getPopularPostsApi();
		
		if (response.status === 200 && response.data) {
			weeklyBestPosts.value = response.data.weeklyBest || [];
			hotPosts.value = response.data.hot || [];
		}
	} catch (error) {
		console.error('Failed to fetch popular posts:', error);
	}
};

onMounted(() => {
	fetchPopularPosts();
});

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

defineExpose({
	fetchPopularPosts
});
</script>

<style scoped>
.popular-content {
	padding: 24px 20px 0;
}

.popular-section {
	margin-bottom: 30px;
}

.section-header {
	margin-bottom: 16px;
}

.section-badge {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.02em;
}

.best-badge {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.hot-badge {
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	color: #fff;
	box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.section-divider {
	height: 1px;
	background: linear-gradient(90deg, transparent 0%, #e0e0e0 50%, transparent 100%);
	margin: 24px 0;
}

.simple-post-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.simple-post-item {
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 16px;
	background: #fff;
	border-radius: 12px;
	border: 1px solid #f0f0f0;
	cursor: pointer;
	transition: all 0.2s ease;
}

.simple-post-item:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	border-color: #e0e0e0;
}

.rank-number {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	border-radius: 50%;
	font-size: 12px;
	font-weight: 600;
	flex-shrink: 0;
}

.rank-1 {
	background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
	color: #fff;
	box-shadow: 0 2px 6px rgba(255, 215, 0, 0.4);
}

.rank-2 {
	background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%);
	color: #fff;
	box-shadow: 0 2px 6px rgba(192, 192, 192, 0.4);
}

.rank-3 {
	background: linear-gradient(135deg, #cd7f32 0%, #b8860b 100%);
	color: #fff;
	box-shadow: 0 2px 6px rgba(205, 127, 50, 0.4);
}

.rank-other {
	background: #f5f5f5;
	color: #666;
	border: 1px solid #e0e0e0;
}

.post-info {
	flex: 1;
	min-width: 0;
}

.post-title {
	font-size: 15px;
	font-weight: 500;
	color: #333;
	margin: 0 0 4px 0;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.post-author {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	color: #999;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

</style>