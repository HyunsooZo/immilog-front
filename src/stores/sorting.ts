import { defineStore } from 'pinia'
import { ISelectItem } from '@/types/interface.ts'

// 위치 정보를 위한 Pinia 스토어
export const useHomeSortingStore = defineStore('sorting', {
  state: () => ({
    code: '',
    name: ''
  }),
  actions: {
    // 위치 설정 메서드
    setSorting(sorting: ISelectItem): void {
      this.code = sorting.code
      this.name = sorting.name
    }
  }
})
