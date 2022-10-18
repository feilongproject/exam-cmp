import { createApp, ref } from 'vue';
import App from './App.vue';

import './assets/main.css';

const app = createApp(App);
app.provide('$noticeShow', ref(false));
app.config.globalProperties.$noticeShow = ref(false);
app.mount('#app');
