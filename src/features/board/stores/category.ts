import { defineStore } from 'pinia';
import type { ISelectItem } from '@/shared/types/common';

// 위치 정보를 위한 Pinia 스토어
export const useHomeCategoryStore = defineStore('location', {
	state: () => ({
		code: '',
		name: '',
	}),
	actions: {
		// 위치 설정 메서드
		setCategory(category: ISelectItem): void {
			this.code = category.code;
			this.name = category.name;
		},
	},
});
