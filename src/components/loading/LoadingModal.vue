<template>
	<div class="loading-modal">
		<div class="loading-content">
			<div class="spinner"></div>
			<p>Loading...</p>
		</div>
	</div>
</template>

<script setup lang="ts">
// 로딩 모달 컴포넌트
</script>

<style scoped>
.loading-modal {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.loading-content {
	background: white;
	padding: 2rem;
	border-radius: 8px;
	text-align: center;
}

.spinner {
	width: 40px;
	height: 40px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #3498db;
	border-radius: 50%;
	animation: spin 2s linear infinite;
	margin: 0 auto 1rem;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}
</style>