<template>
  <div class="list-wrap item_preview">
    <div class="item__list">
      <div class="thumb" v-for="(image, index) in chatImages" :key="index">
        <img :src="image" alt="" />
        <button type="button" class="button--del" @click="removeImage(index)">
          <i class="blind">삭제</i>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, PropType } from 'vue';  // PropType을 추가로 임포트

const props = defineProps({
  chatImages: Array as PropType<string[]>
});

const emits = defineEmits(['removeImage'])

const removeImage = (index: number) => {
  emits('removeImage', index);
}
</script>