<template>
	<div class="footer">
		<div class="button-wrap">
			<button
				@click="props.onClick"
				:class="{
					'button button--positive': computedCondition,
					'button button--disabled': !computedCondition,
				}"
				:disabled="!computedCondition"
				role="link"
				id="registerBtn"
			>
				회원가입
			</button>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';

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

const computedCondition = computed(() => props.condition);
</script>
