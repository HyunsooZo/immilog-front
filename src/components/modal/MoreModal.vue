<template>
	<div class="modal" tabindex="-1" role="dialog">
		<div class="modal-content" @click.stop>
			<div class="modal-header">
				<p class="modal-title">{{ title }}</p>
				<button type="button" class="button-icon button--close" role="link" @click="closeModal">
					<i class="blind">닫기</i>
				</button>
			</div>
			<div class="modal-body">
				<div class="list-wrap">
					<ul>
						<li v-for="(item, index) in list" :key="index" class="item">
							<button type="button" class="button" @click="">
								<span>{{ item.name }}</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const closeModal = () => {
	emits('update:alertValue', false);
};
</script>
