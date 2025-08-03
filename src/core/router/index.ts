import { createRouter, createWebHistory } from 'vue-router';
import SignUpPage from '@/pages/SignUpPage.vue';
import SignInPage from '@/pages/SignInPage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import HomePage from '@/pages/HomePage.vue';
import BoardPage from '@/pages/BoardPage.vue';
import BoardDetailPage from '@/pages/BoardDetailPage.vue';
import ResultPage from '@/pages/ResultPage.vue';
import ChatPage from '@/pages/ChatPage.vue';
import ChatDetailPage from '@/pages/ChatDetailPage.vue';
import JobBoardPage from '@/pages/JobBoardPage.vue';
import JobBoardDetailPage from '@/pages/JobBoardDetailPage.vue';
import MyPage from '@/pages/MyPage.vue';
import ProfileEditPage from '@/pages/ProfileEditPage.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/sign-up',
			name: 'SignUp',
			component: SignUpPage,
			meta: { hideFooter: true },
		},
		{
			path: '/sign-in',
			name: 'SignIn',
			component: SignInPage,
			meta: { hideFooter: true },
		},
		{
			path: '/search',
			name: 'Search',
			component: SearchPage,
			meta: { hideFooter: true },
		},
		{
			path: '/',
			name: 'Home',
			component: HomePage,
		},
		{
			path: '/board',
			name: 'Board',
			component: BoardPage,
		},
		{
			path: '/board/:postId',
			name: 'BoardDetail',
			component: BoardDetailPage,
			props: true,
		},
		{
			path: '/result',
			name: 'Result',
			component: ResultPage,
			props: route => ({
				titleEmphasis: route.query.titleEmphasis,
				content: route.query.content,
			}),
		},
		{
			path: '/chat',
			name: 'ChatRooms',
			component: ChatPage,
		},
		{
			path: '/chat/:chatRoomId',
			name: 'ChatDetail',
			component: ChatDetailPage,
			props: true,
			meta: { hideFooter: true },
		},
		{
			path: '/job-board',
			name: 'JobBoard',
			component: JobBoardPage,
		},
		{
			path: '/job-board/:postId',
			name: 'JobBoardDetail',
			component: JobBoardDetailPage,
		},
		{
			path: '/my-page',
			name: 'MyPage',
			component: MyPage,
		},
		{
			path: '/profile-edit',
			name: 'ProfileEdit',
			component: ProfileEditPage,
		},
	],
});

export default router;
