import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Подключаем Vuex

// Создаем приложение Vue 3 и подключаем Vuex и маршрутизатор
createApp(App)
  .use(store)
  .use(router)
  .mount('#app');
