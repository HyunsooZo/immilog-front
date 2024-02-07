import { defineStore } from 'pinia';

export const menuStore = defineStore({
	id: 'menu',
	state: () => ({
		menu: 0,
	}),
	actions: {
		setMenu(number) {
			this.menu = number;
		},
	},
});
