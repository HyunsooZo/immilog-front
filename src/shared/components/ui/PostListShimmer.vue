<template>
	<div class="list-wrap">
		<PostShimmer v-for="n in count" :key="n" />
	</div>
</template>

<script setup lang="ts">
import PostShimmer from './PostShimmer.vue';

interface Props {
	count?: number;
}

const props = withDefaults(defineProps<Props>(), {
	count: 5
});
</script>

