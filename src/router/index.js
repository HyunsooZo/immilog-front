import { createRouter, createWebHistory } from 'vue-router';
import SignUpView from '@/views/SignUpView.vue';
import SignInView from '@/views/SignInView.vue';
import HomeView from '@/views/HomeView.vue';
import MyPageView from '@/views/MyPageView.vue';
import JobBoardView from '@/views/JobBoardView.vue';
import ChatView from '@/views/ChatView.vue';
import BoardView from '@/views/BoardView.vue';
import EmailVerificationView from '@/views/EmailVerificationView.vue';
import BoardDetailView from '@/views/BoardDetailView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/sign-up',
			name: 'SignUp',
			component: SignUpView,
			meta: { hideFooter: true },
		},
		{
			path: '/sign-in',
			name: 'SignIn',
			component: SignInView,
			meta: { hideFooter: true },
		},
		{
			path: '/',
			name: 'Home',
			component: HomeView,
		},
		{
			path: '/my-page',
			name: 'MyPage',
			component: MyPageView,
		},
		{
			path: '/job-board',
			name: 'JobBoard',
			component: JobBoardView,
		},
		{
			path: '/chat',
			name: 'Chat',
			component: ChatView,
		},
		{
			path: '/board',
			name: 'Board',
			component: BoardView,
		},
		{
			path: '/board/:id',
			name: 'BoardDetail',
			component: BoardDetailView,
		},
		{
			path: '/email-verification',
			name: 'EmailVerification',
			component: EmailVerificationView,
		},
	],
});

export default router;
