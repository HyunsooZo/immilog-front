<template>
	<div class="modal _detail-view" @click.self="closeModal">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">
					{{ title }}
				</p>
				<button
					type="button"
					class="button-icon button--close"
					@click="closeModal"
				>
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<div class="item">
						<div class="text__wrap">
							<div class="list__item">
								<div class="text__item">
									<p class="text">
										{{ content }}
									</p>
								</div>
							</div>
						</div>
						<!-- <div class="attachments__wrap">
							<div class="attachments__item">
								<div class="item__display">
									<img src="@/assets/images/email-icon-logo.png" alt="" />
								</div>
							</div>
						</div> -->
					</div>
				</div>
				<div class="modal-footer">
					<div class="button-wrap">
						<button class="button button--positive" @click="">
							링크버튼 필요 시 사용
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
//모달 닫는 에밋
const props = defineProps<{
	title: string;
	content: string;
}>();
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};
</script>
