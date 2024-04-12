<template>
	<div class="top-box">
		<div class="page-header" v-if="isEmptyOrNull(props.title)">
			<span>{{ props.title }}</span>
		</div>
		<div class="page-guide" v-if="isEmptyOrNull(props.subTitle) || isEmptyOrNull(props.text)">
			<div class="tit-default" v-if="isEmptyOrNull(props.subTitle)">
				<span>{{ props.subTitle }}</span>
			</div>
			<p class="txt-default" v-if="isEmptyOrNull(props.text)">
				{{ props.text }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	subTitle: {
		type: String,
		default: '',
	},
	text: {
		type: String,
		default: '',
	},
});

const isEmptyOrNull = (value: string) => {
	return value || value === '';
};
</script>

<style lang="scss" scoped></style>
