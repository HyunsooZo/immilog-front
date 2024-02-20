import { createRouter, createWebHistory } from 'vue-router';
import SignUpView from '@/views/SignUpView.vue';
import SignInView from '@/views/SignInView.vue';
import HomeView from '@/views/HomeView.vue';
import JobBoardView from '@/views/JobBoardView.vue';
import ChatView from '@/views/ChatView.vue';
import ChatDetailView from '@/components/ChatDetailView.vue';
import SideMenu from '@/components/SideMenu.vue';
import BoardView from '@/views/BoardView.vue';
import BoardDetailView from '@/views/BoardDetailView.vue';
import ResultViewVue from '@/views/ResultView.vue';
import MyPageView from '@/views/MyPageView.vue';
import ProfileEdit from '@/views/ProfileEdit.vue';

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
			path: '/chat-view',
			name: 'ChatDetail',
			component: ChatDetailView,
		},
		{
			path: '/side-menu',
			name: 'SideMenu',
			component: SideMenu,
		},
		{
			path: '/board',
			name: 'Board',
			component: BoardView,
		},
		{
			path: '/board/:postId',
			name: 'BoardDetail',
			component: BoardDetailView,
			props: true,
		},
		{
			path: '/result',
			name: 'Result',
			component: ResultViewVue,
			props: route => ({
				titleEmphasis: route.query.titleEmphasis,
				content: route.query.content,
			}),
		},
		{
			path: '/my-page',
			name: 'MyPage',
			component: MyPageView,
		},
		{
			path: '/profile-edit',
			name: 'ProfileEdit',
			component: ProfileEdit,
		},
	],
});

export default router;
