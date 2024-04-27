<template>
	<div class="modal _preview" tabindex="-1" role="dialog" @click.self="closeModal">
		<div class="modal-content">
			<div class="modal-body">
				<div class="item__pic">
					<!-- <button
						class="button-icon button--close"
						role="link"
						@click="closeModal"
					>
						<i class="blind">취소</i>
					</button> -->
					<img v-if="userProfile.userProfileUrl" :src="userProfile.userProfileUrl" alt="" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps({
	userProfile: {
		type: Object,
		required: true,
		default: () => ({
			userProfileUrl: '',
		}),
	},
});

//모달 닫는 에밋
const emits = defineEmits(['close']);

const closeModal = () => {
	emits('close');
};
</script>
