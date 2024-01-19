import { createRouter, createWebHistory } from 'vue-router';
import SignUpView from '@/views/SignUpView.vue';
import SignInView from '@/views/SignInView.vue';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/sign-up',
			name: 'SignUp',
			component: SignUpView,
		},
		{
			path: '/sign-in',
			name: 'SignIn',
			component: SignInView,
		},
		{
			path: '/',
			name: 'Home',
			component: HomeView,
		},
	],
});

export default router;
