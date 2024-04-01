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
				<p class="text__item">
					{{ t('noContent.noContent1') }}{{ item
					}}{{ t('noContent.noContent2') }}
				</p>
				<p class="text__item">
					{{ item }}{{ t('noContent.noContent3') }} {{ item
					}}{{ t('noContent.noContent4') }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { myPostIcon } from '@/utils/icons.js';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
	item: {
		type: String,
		required: true,
	},
});
</script>
