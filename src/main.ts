import '@/assets/common.css'
import '@/assets/contents.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/router/index.js'
import setupI18n from './i18n.js'

document.addEventListener(
  'deviceready',
  () => {
    // Cordova is ready - 앱 초기화 완료
  },
  false
)

const initializeApp = async (): Promise<void> => {
  const pinia = createPinia()
  const app = createApp(App)

  const i18n = await setupI18n()
  app.use(router)
  app.use(i18n)
  app.use(pinia)

  app.mount('#app')
}

initializeApp()
