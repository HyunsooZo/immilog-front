import { defineStore } from 'pinia';

export const useMenuStore = defineStore({
	id: 'menu',
	state: () => ({
		menu: 0,
	}),
	actions: {
		setMenu(number) {
			this.menu = number;
		},
		getMenu() {
			return this.menu;
		},
	},
});
