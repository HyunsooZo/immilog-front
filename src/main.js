import '@/assets/common.css';
import '@/assets/contents.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia); // Pinia를 애플리케이션에 등록

app.mount('#app');
