<template>
	<div class="content">
		<div class="msg-wrap">
			<i class="item__icon item__icon--check">
				<!-- //완료 .item__icon--check / 취소 .item__icon--error / 알림 .item__icon--warning -->
				<div class="svg--item-wrap">
					<svg class="svg--circle" viewBox="0 0 168 168">
						<path :d="resultCircleIcon" />
					</svg>
					<!-- check -->
					<svg class="svg--check" viewBox="0 0 168 168">
						<path d="M50 85 75 110 120 65" />
					</svg>
					<!-- error -->
					<svg class="svg--error path--1" viewBox="0 0 168 168">
						<path d="M55 55 113 113" />
					</svg>
					<svg class="svg--error path--2" viewBox="0 0 168 168">
						<path d="M113 55 55 113" />
					</svg>
					<!-- warning -->
					<svg class="svg--warning" viewBox="0 0 168 168">
						<path d="M84 50 84 96" />
						<path d="M84 114 84 118" />
					</svg>
				</div>
			</i>
			<p class="item__msg">
				<em>{{ titleEmphasis }}</em>
			</p>
			<p class="item__description" div v-html="content"></p>
		</div>

		<div class="button-wrap">
			<button class="button button--primary" @click="onLogin">
				{{ t('resultView.confirm') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { resultCircleIcon } from '@/shared/utils/icons';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();

const onLogin = () => {
	router.push({ name: 'SignIn' });
};
defineProps({
	titleEmphasis: {
		type: String,
	},
	titleNormal: {
		type: String,
	},
	content: {
		type: String,
	},
});
</script>
