import { ref, computed, Ref, ComputedRef } from 'vue'
import { defineStore } from 'pinia'

// 카운터 스토어 정의
export const useCounterStore = defineStore('counter', () => {
  // 카운터 값
  const count: Ref<number> = ref(0)

  // 계산된 값: 카운트의 두 배
  const doubleCount: ComputedRef<number> = computed(() => count.value * 2)

  // 카운터 증가 함수
  function increment(): void {
    count.value++
  }

  // 스토어에서 사용할 변수와 함수 반환
  return { count, doubleCount, increment }
})
