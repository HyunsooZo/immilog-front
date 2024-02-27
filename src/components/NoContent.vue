<template>
	<div class="item item--noreply">
		<!-- 댓글 없음 -->
		<div class="noreply__wrap">
			<div class="item__bi">
				<svg viewBox="0 0 16 16" class="bi-blockquote-left">
					<path :d="myPostIcon" />
				</svg>
			</div>
			<div class="noreply__text">
				<p class="text__item">아직 작성된 {{ item }}이 없습니다.</p>
				<p class="text__item">
					{{ item }}쓰기 버튼을 눌러 {{ item }}을 남겨보세요.
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { myPostIcon } from '@/utils/icons.js';
defineProps({
	item: {
		type: String,
		required: true,
	},
});
</script>
