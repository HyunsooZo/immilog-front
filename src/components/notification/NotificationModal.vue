<template>
	<div class="modal modal--full">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">알림</p>
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<div class="item">
						<div class="text__wrap">
							<div class="list__item">
								<div class="text__item">
									<p class="title">title</p>
									<p class="text">
										content
										<br />
										content
										<br />
										content
									</p>
								</div>
							</div>
						</div>
						<div class="attachments__wrap">
							<div class="attachments__item">
								<div class="item__display">
									<img src="@/assets/images/email-icon-logo.png" alt="" />
								</div>
							</div>
							<!-- //loop -->
						</div>
					</div>
					<!-- // -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo.ts';

//모달 닫는 에밋
const emits = defineEmits(['close']);

const userInfo = useUserInfoStore();

// modal open/close 시 body 컨트롤
const modalOpenClass = () => {
	document.body.classList.add('inactive');
};
const modalCloseClass = () => {
	document.body.classList.remove('inactive');
};

const closeModal = () => {
	emits('close');
	modalCloseClass();
};

const getNotificationsApi = () => {
	// 작성 필요 
};

onMounted(() => {
	modalOpenClass();
	getNotificationsApi();
});

onUnmounted(() => {
	modalCloseClass();
});
</script>
