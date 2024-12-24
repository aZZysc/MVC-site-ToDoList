<template>
  <div class="container">
    <h2>Регистрация</h2>
    <form @submit.prevent="registerUser">
      <!-- Поле логина | Максимальная длина имени пользователя -->
      <input
        type="text"
        v-model="username"
        placeholder="Логин"
        maxlength="20"
        autocomplete="off"
        required
      />

      <!-- Поле пароля с валидацией и отображением требований -->
      <input
        type="password"
        v-model="password"
        placeholder="Пароль"
        @focus="showPasswordRequirements = true"
        @blur="handlePasswordBlur"
        @input="validatePassword"
        autocomplete="new-password"
        required
      />

      <!-- Плавное появление/исчезновение требований к паролю -->
      <transition name="fade">
        <div v-if="showPasswordRequirements" class="password-requirements">
          <p :class="{ valid: passwordValidations.hasMinLength }">✔ не менее 6 символов</p>
          <p :class="{ valid: passwordValidations.hasUpperCase }">✔ хотя бы одна заглавная буква</p>
          <p :class="{ valid: passwordValidations.hasDigit }">✔ цифры</p>
          <p :class="{ valid: passwordValidations.hasLatinLetters }">✔ латинские буквы</p>
        </div>
      </transition>

      <!-- Сообщение об ошибке -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <!-- Кнопка регистрации с добавлением отступа -->
      <button type="submit" :disabled="!isPasswordValid" style="margin-top: 20px;">Зарегистрироваться</button>

      <!-- Ссылка на страницу входа -->
      <p class="login-link">
        Уже есть аккаунт?
        <router-link to="/login">Войти</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      username: '',
      password: '',
      showPasswordRequirements: false,
      errorMessage: '',
      passwordValidations: {
        hasMinLength: false,
        hasUpperCase: false,
        hasDigit: false,
        hasLatinLetters: false
      }
    };
  },
  computed: {
    isPasswordValid() {
      return Object.values(this.passwordValidations).every(Boolean);
    }
  },
  methods: {
    validatePassword() {
      const password = this.password;

      // Убираем сообщение об ошибке при любом изменении
      if (this.errorMessage) {
        this.errorMessage = '';
      }

      // Валидация пароля
      this.passwordValidations.hasMinLength = password.length >= 6;
      this.passwordValidations.hasUpperCase = /[A-Z]/.test(password);
      this.passwordValidations.hasDigit = /\d/.test(password);
      this.passwordValidations.hasLatinLetters = /[a-zA-Z]/.test(password);
    },
    handlePasswordBlur() {
      if (!this.password) {
        this.showPasswordRequirements = false;
      }
    },
    registerUser() {
      const userData = {
        username: this.username,
        password: this.password
      };

      api.register(userData)
        .then(response => {
          console.log('Пользователь зарегистрирован:', response.data);
          this.$router.push('/login');
        })
        .catch(error => {
          if (error.response && error.response.data.password) {
            const errorMessage = error.response.data.password.join(' ');

            // Заменяем сообщение "This password is too common" на русское
            if (errorMessage.includes("This password is too common")) {
              this.errorMessage = "Этот пароль слишком распространён.";
            } else {
              this.errorMessage = errorMessage;
            }
          } else if (error.response && error.response.data.username) {
            const usernameErrorMessage = error.response.data.username.join(' ');

            // Заменяем сообщение "A user with that username already exists." на русское
            if (usernameErrorMessage.includes("A user with that username already exists.")) {
              this.errorMessage = "Пользователь с таким именем уже существует.";
            } else {
              this.errorMessage = usernameErrorMessage;
            }
          } else {
            this.errorMessage = 'Ошибка регистрации';
          }
          console.error('Ошибка регистрации:', error.response ? error.response.data : error);
        });
    }
  }
};
</script>

<style scoped>
@import "@/styles/global.css";

/* Стиль для блока с требованиями */
.password-requirements {
  text-align: left;
  margin-left: 10px;
  margin-bottom: 20px;
  opacity: 1;
  transition: opacity 0.5s ease;  /* Плавное исчезновение */
}

.password-requirements p {
  margin: 5px 0;
  color: red;
}

.password-requirements p.valid {
  color: green;
}

.error {
  color: red;
  margin-bottom: 20px; /* Отступ для ошибок */
}

.login-link {
  margin-top: 20px;
  text-align: center;
}

/* Transition для плавного исчезновения текста */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>