<template>
	<div class="sidemenu-wrap" @click.self="closeModal">
		<div class="sidemenu__inner">
			<div class="sidemenu-header">
				<button class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">취소</i>
				</button>
			</div>
			<div class="sidemenu-body">
				<ul>
					<li>목록을 만들어</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>

//모달 닫는 에밋 (false 넘김)
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};
</script>
