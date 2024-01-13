<template>
	<div>
		<form @submit.prevent="signIn">
			<input v-model="email" type="text" placeholder="" />
			<input v-model="password" type="password" placeholder="" />
			<button type="submit">로그인</button>
		</form>
		<a @click="onSignUp">회원가입</a>
		<a href="#">비밀번호 찾기</a>
		<a href="#">아이디 찾기</a>
		<button>구글 계정으로 로그인</button>
		<button>Apple 계정으로 로그인</button>
		<button>KaKao 계정으로 로그인</button>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import useAxios from '@/composables/useAxios.js';
import { ref } from 'vue';
import { useLocationStore } from '@/stores/location.js';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

const email = ref('');
const password = ref('');
const router = useRouter();
const { sendRequest } = useAxios();

const onSignUp = () => {
	router.push({ name: 'SignUp' });
};

const signIn = async () => {
	try {
		const { status, data } = await sendRequest('post', '/users/sign-in', {
			email: email.value,
			password: password.value,
			//네이티브 개발 이후에는 위치정보는 백엔드에서만 관리하도록 수정할 예정
			latitude: useLocationStore().latitude,
			longitude: useLocationStore().longitude,
		});

		if (status === 200) {
			console.log(data.data);
			console.dir(data.data);
		}
	} catch (error) {
		console.log(error);
	}
};
</script>
