<template>
	<div class="top-box">
		<div class="page-header">
			<span>{{ props.title }}</span>
		</div>
		<div class="page-guide">
			<div class="tit-default">
				<span>{{ props.subTitle }}</span>
			</div>
			<p class="txt-default">{{ props.text }}</p>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	subTitle: {
		type: String,
	},
	text: {
		type: String,
	},
});
</script>

<style lang="scss" scoped></style>
