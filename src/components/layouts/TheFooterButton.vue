<template>
	<!-- footer 영역 -->
	<div class="footer">
		<div class="button-wrap">
			<!-- 회원가입 버튼 -->
			<button
				@click="props.onClick"
				:class="buttonClasses"
				:disabled="!props.condition"
				role="link"
				id="registerBtn"
			>
				회원가입
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// props 정의
const props = defineProps({
	onClick: {
		type: Function,
		required: true,
	},
	condition: {
		type: Boolean,
		required: true,
	},
});

// 버튼 클래스를 계산하는 computed 프로퍼티
const buttonClasses = computed(() => ({
	'button button--positive': props.condition,
	'button button--disabled': !props.condition,
}));
</script>
