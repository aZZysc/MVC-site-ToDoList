<template>
  <div class="container">
    <h2>Вход</h2>
    <form @submit.prevent="loginUser">
      <input type="text" v-model="username" placeholder="Логин" autocomplete="username" required />
      <input type="password" v-model="password" placeholder="Пароль" autocomplete="current-password" required />
      <button type="submit">Войти</button>
    </form>
    <!-- Добавляем ссылку на страницу регистрации -->
    <p>Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
    <!-- Сообщение об ошибке -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    loginUser() {
      const userData = {
        username: this.username,
        password: this.password
      };

      api.login(userData)
        .then(response => {
          const token = response.data.access;
          this.$store.dispatch('saveToken', token);  // Сохраняем токен в Vuex
          this.$router.push('/tasks');  // Перенаправляем на страницу задач
        })
        .catch(error => {
          // Обрабатываем ошибку и выводим сообщение
          if (error.response && error.response.data && error.response.data.detail) {
            this.errorMessage = 'Неверный логин или пароль.';
          } else {
            this.errorMessage = 'Произошла ошибка при входе. Попробуйте снова.';
          }
          console.error('Ошибка входа:', error);
        });
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
