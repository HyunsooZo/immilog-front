<template>
	<div class="logo-container">
		<svg :width="size" :height="size" viewBox="0 0 120 90" class="immilog-logo">
			<defs>
				<linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color: #3730a3; stop-opacity: 1" />
					<stop offset="100%" style="stop-color: #312e81; stop-opacity: 1" />
				</linearGradient>
			</defs>

			<!-- Background rounded rectangle -->
			<rect width="120" height="90" rx="24" ry="24" fill="url(#logoGradient)" />

			<!-- Circle 1 -->
			<circle
				cx="43"
				cy="37"
				r="32"
				fill="none"
				stroke="#a5b4fc"
				stroke-width="6"
				class="circle1"
			/>

			<!-- Circle 2 -->
			<circle
				cx="77"
				cy="53"
				r="32"
				fill="none"
				stroke="#ddd6fe"
				stroke-width="6"
				class="circle2"
			/>
		</svg>
	</div>
</template>

<script setup lang="ts">
interface Props {
	size?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
	size: 120,
});
</script>

<style scoped>
.logo-container {
	display: inline-block;
}

.immilog-logo {
	display: block;
}

.circle1,
.circle2 {
	transform-origin: center;
}

/* Animation classes that can be applied from parent */
.logo-container.animate .circle1 {
	animation: fadeInScale 1.2s ease-out 0.2s both;
}

.logo-container.animate .circle2 {
	animation: fadeInScale 1.2s ease-out 0.6s both;
}

@keyframes fadeInScale {
	0% {
		opacity: 0;
		transform: scale(0.3);
	}
	60% {
		opacity: 0.8;
		transform: scale(1.1);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}
</style>
