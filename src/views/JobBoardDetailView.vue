<template>
	<TheHeader />
	<div class="content">
		<div class="list-top-wrap">
			<!-- 카테고리 정렬 -->
		</div>

		<!-- 목록 -->
		<div class="list-wrap">
			<JobContent />
		</div>
	</div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/layouts/TheHeader.vue';
import JobContent from '@/components/board/JobContent.vue';
</script>
