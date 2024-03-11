import { createRouter, createWebHistory } from 'vue-router';
import SignUpView from '@/views/SignUpView.vue';
import SignInView from '@/views/SignInView.vue';
import SearchView from '@/views/SearchView.vue';
import HomeView from '@/views/HomeView.vue';
import BoardView from '@/views/BoardView.vue';
import BoardDetailView from '@/views/BoardDetailView.vue';
import ResultViewVue from '@/views/ResultView.vue';
import ChatView from '@/views/ChatView.vue';
import ChatDetailView from '@/views/ChatDetailView.vue';
import JobBoardView from '@/views/JobBoardView.vue';
import JobBoardDetailView from '@/views/JobBoardDetailView.vue';
import MyPageView from '@/views/MyPageView.vue';
import ProfileEditView from '@/views/ProfileEditView.vue';

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
			path: '/search',
			name: 'Search',
			component: SearchView,
			meta: { hideFooter: true },
		},
		{
			path: '/',
			name: 'Home',
			component: HomeView,
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
			path: '/chat',
			name: 'ChatRooms',
			component: ChatView,
		},
		{
			path: '/chat/:chatRoomId',
			name: 'ChatDetail',
			component: ChatDetailView,
			props: true,
			meta: { hideFooter: true },
		},
		{
			path: '/job-board',
			name: 'JobBoard',
			component: JobBoardView,
		},
		{
			path: '/job-board/:postId',
			name: 'JobBoardDetail',
			component: JobBoardDetailView,
		},
		{
			path: '/my-page',
			name: 'MyPage',
			component: MyPageView,
		},
		{
			path: '/profile-edit',
			name: 'ProfileEditView',
			component: ProfileEditView,
		},
	],
});

export default router;
