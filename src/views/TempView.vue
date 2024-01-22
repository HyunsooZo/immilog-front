<template>
	<div class="content">
		<button class="button button--search" role="link">검색</button>
	</div>
	<div class="modal" tabindex="-1" role="dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Modal title</h5>
				<button type="button" class="button-util-icon close" data-dismiss="modal" aria-label="Close">닫기</button>
			</div>
			<div class="modal-body">
				<p>내용</p>
			</div>
			<div class="modal-footer">
				<div class="button-wrap">
					<button type="button" class="button button--cancle" data-dismiss="modal">취소</button>
					<button type="button" class="button button--positive">확인</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup></script>
