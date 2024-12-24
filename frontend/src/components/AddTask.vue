<template>
  <div class="task-form">
    <!-- Навигационная панель -->
    <div class="navbar">
      <router-link to="/tasks" class="back-btn">
        <img src="@/assets/back-icon.png" alt="Назад" />
      </router-link>
      <button @click="saveTask" class="save-btn">
        <img src="@/assets/save-icon.png" alt="Сохранить" />
      </button>
    </div>

    <!-- Форма задачи -->
    <input type="text" v-model="taskTitle" placeholder="Задача для выполнения..." maxlength="120" required />

    <!-- Сообщение об ошибке -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      taskTitle: '',
      errorMessage: '',
      isEditing: false,
      taskId: null,
    };
  },
  created() {
    const token = this.$store.getters.getToken;
    const taskId = this.$route.query.taskId;

    if (taskId) {
      this.isEditing = true;
      this.taskId = taskId;

      // Загружаем данные задачи для редактирования
      api.getTasks(token)
        .then(response => {
          const task = response.data.find(t => String(t.id) === String(this.taskId)); // Приведение к строке
          if (task) {
            this.taskTitle = task.text;
          } else {
            this.errorMessage = 'Задача не найдена';
          }
        })
        .catch(error => {
          console.error('Ошибка при получении задачи:', error);
          this.errorMessage = 'Ошибка при загрузке задачи';
        });
    }
  },
  methods: {
    saveTask() {
      if (!this.taskTitle) {
        this.errorMessage = 'Пожалуйста, введите название задачи';
        return;
      }

      const token = this.$store.getters.getToken;
      const taskData = {
        text: this.taskTitle,
      };

      if (this.isEditing) {
        api.updateTask(this.taskId, taskData, token)
          .then(() => {
            this.$router.push('/tasks');
          })
          .catch(error => {
            console.error('Ошибка при обновлении задачи:', error);
            this.errorMessage = 'Ошибка при сохранении задачи';
          });
      } else {
        api.createTask(taskData, token)
          .then(() => {
            this.$router.push('/tasks');
          })
          .catch(error => {
            console.error('Ошибка при создании задачи:', error);
            this.errorMessage = 'Ошибка при создании задачи';
          });
      }
    }
  }
};
</script>

<style scoped>
@import "@/styles/add-task.css";

.error {
  color: red;
  margin-top: 10px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f7f7f7;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn img,
.save-btn img {
  width: 30px;
  height: 30px;
}

.task-form {
  padding: 20px;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}
</style>
