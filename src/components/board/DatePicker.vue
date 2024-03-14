<template>
	<DatePicker v-model="selectedDate" format="yyyy-MM-dd"></DatePicker>
	<p>채용마감: {{ selectedDate }}</p>
</template>

<script setup>
import { ref } from 'vue';

const selectedDate = ref('');
</script>