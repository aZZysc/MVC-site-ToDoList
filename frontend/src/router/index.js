import { createRouter, createWebHistory } from 'vue-router'; // Для Vue 3
import UserLogin from '../components/UserLogin.vue';
import UserRegister from '../components/UserRegister.vue';
import TaskList from '../components/TaskList.vue';
import AddTask from '../components/AddTask.vue';

const routes = [
  { path: '/', redirect: '/register' }, // Перенаправляем на /register
  { path: '/login', component: UserLogin },
  { path: '/register', component: UserRegister },
  { path: '/tasks', component: TaskList },
  { path: '/add-task', component: AddTask }
];

// Создаем router для Vue 3
const router = createRouter({
  history: createWebHistory(), // Используем history mode для нормальных URL
  routes
});

export default router;
