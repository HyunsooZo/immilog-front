<template>
	<!-- footer 영역 -->
	<div class="footer">
		<div class="button-wrap">
			<!-- 회원가입 버튼 -->
			<button
				type="button"
				@click="props.onClick"
				:class="buttonClasses"
				:disabled="!props.condition"
				id="registerBtn"
			>
				{{ t('theFooterButton.register') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// props 정의
const props = defineProps<{
	onClick: (event: MouseEvent) => void;
	condition: boolean;
}>();

// 버튼 클래스를 계산하는 computed 프로퍼티
const buttonClasses = computed(() => ({
	'button button--positive': props.condition,
	'button button--disabled': !props.condition,
}));
</script>
