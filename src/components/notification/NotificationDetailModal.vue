<template>
	<div class="modal _detail-view">
		<div class="modal-content">
			<div class="modal-header">
				<p class="modal-title">
					<!-- {{ item.title }} -->
					테스트 공지사항 입니다. 테스트 공지사항 입니다. 테스트 공지사항 입니다.
				</p>
				<button type="button" class="button-icon button--close" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<div class="item">
						<div class=" text__wrap">
							<div class="list__item">
								<div class="text__item">
									<p class="text">
										<!-- {{ item.content }} -->
										내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금
										길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하
										깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허
										낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄
										내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금
										길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄
										내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금
										길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄 내용을 조금 길게써볼까요? 하하 깔깔 호호 허허 낄낄
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
//모달 닫는 에밋
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};
</script>
