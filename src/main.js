import '@/assets/common.css';
import '@/assets/contents.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from '@/router';
import setupI18n from './i18n';

const pinia = createPinia();
const app = createApp(App);
const i18n = await setupI18n();

app.use(router);
app.use(i18n);
app.use(pinia); // Pinia를 애플리케이션에 등록

app.mount('#app');
