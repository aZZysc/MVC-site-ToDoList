<template>
  <div>
    <!-- Navbar -->
    <div class="navbar">
      <div class="username-display">
        <h2>{{ username }}</h2>
      </div>
      <div class="logout" @click="logout">
        <img src="@/assets/logout-icon.png" alt="Выйти" />
      </div>
    </div>

    <!-- Контейнер задач -->
    <div class="tasks-container">
      <!-- Если нет задач -->
      <div v-if="tasks.length === 0" class="no-tasks">
        <img src="@/assets/no-tasks-image.png" alt="No tasks" />
        <p>Задач пока нет</p>
      </div>

      <!-- Если есть задачи -->
      <div v-else class="task-list">
        <div v-for="task in tasks" :key="task.id" class="task-item">
          <div class="task-left">
            <!-- Кнопка статуса -->
            <span class="check-icon" :class="{ completed: task.is_done }" @click="toggleTaskCompletion(task)">
              <img v-if="task.is_done" src="@/assets/checked-icon.png" alt="Выполнено">
            </span>
            <!-- Вывод названия задачи с возможностью открыть полное название -->
            <p @click="openModal(task)" :class="{ 'completed-task': task.is_done }" class="task-title">
              {{ truncateText(task.text, getTruncatedLength()) }}
            </p>
          </div>
          <div class="task-right">
            <span class="delete-icon" @click="confirmDeleteTask(task)">
              <div class="delete-circle">
                <img src="@/assets/delete-icon.png" alt="Удалить">
              </div>
            </span>
          </div>
        </div>
      </div>

      <!-- Кнопка добавления задачи -->
      <div class="add-task-btn" @click="goToAddTask">
        <img src="@/assets/add-icon.png" alt="Добавить задачу" />
      </div>

      <!-- Всплывающее окно с полным текстом задачи -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <p>{{ selectedTask.text }}</p>
          <button @click="closeModal">Закрыть</button>
          <button @click="editTask(selectedTask.id)">Редактировать</button> <!-- Кнопка редактирования задачи -->
        </div>
      </div>

      <!-- Всплывающее окно для удаления задачи -->
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal">
          <p>Вы действительно хотите удалить выбранную задачу?</p>
          <button @click="deleteTask">Да</button>
          <button @click="cancelDelete">Нет</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      tasks: [],
      username: '',
      showDeleteConfirm: false,
      taskToDelete: null,
      showModal: false,
      selectedTask: null
    };
  },
  created() {
    const token = this.$store.getters.getToken;
    if (!token) {
      this.$router.push('/login');
      return;
    }

    // Запрос для получения задач
    api.getTasks(token)
      .then(response => {
        this.tasks = response.data;
      })
      .catch(error => {
        console.error('Ошибка при получении задач:', error);
      });

    // Запрос для получения никнейма пользователя
    api.getUserInfo(token)
      .then(response => {
        this.username = response.data.username;
      })
      .catch(error => {
        console.error('Ошибка при получении информации о пользователе:', error);
      });
  },
  methods: {
    goToAddTask() {
      this.$router.push('/add-task');
    },
    // Изменение статуса задачи
    toggleTaskCompletion(task) {
      task.is_done = !task.is_done;
      // Обновляем статус задачи в базе данных
      api.updateTask(task.id, {is_done: task.is_done}, this.$store.getters.getToken)
          .then(() => {
            console.log(`Статус задачи "${task.text}" изменен на ${task.is_done ? 'выполнен' : 'не выполнен'}`);
          })
          .catch(error => {
            console.error('Ошибка при обновлении задачи:', error);
          });
    },
    confirmDeleteTask(task) {
      this.taskToDelete = task;
      this.showDeleteConfirm = true;  // Показать окно подтверждения
    },
    deleteTask() {
      // Удаляем задачу
      api.deleteTask(this.taskToDelete.id, this.$store.getters.getToken)
          .then(() => {
            this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete.id);  // Убираем задачу с фронтенда
            this.showDeleteConfirm = false;
          })
          .catch(error => {
            console.error('Ошибка при удалении задачи:', error);
          });
    },
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.taskToDelete = null;  // Сбрасываем задачу для удаления
    },
    logout() {
      this.$store.dispatch('saveToken', null);  // Сбрасываем токен в Vuex
      this.$router.push('/login');  // Перенаправляем на страницу логина
    },
    // Открыть модальное окно с полным текстом задачи
    openModal(task) {
      this.selectedTask = task;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedTask = null;
    },
    // Переход на страницу редактирования задачи
    editTask(taskId) {
      this.$router.push({path: '/add-task', query: {taskId: taskId}});
    },
    // Метод для динамического определения длины текста в зависимости от ширины экрана
    getTruncatedLength() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 480) {
        return 14; // для маленьких экранов
      } else if (screenWidth <= 768) {
        return 25; // для средних экранов
      } else {
        return 40; // для больших экранов
      }
    },
    truncateText(text, length) {
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    }
  }
};
</script>

<style scoped>
@import "@/styles/global.css";
@import "@/styles/tasks.css";

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #f7f7f7;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.username-display {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  flex: 1;
}

.logout {
  cursor: pointer;
  position: absolute;
  right: 20px;
}

.logout img {
  width: 30px;
  height: 30px;
}

/* Контейнер задач */
.tasks-container {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  padding-bottom: 150px;
  max-height: calc(100vh - 80px - 150px);
  overflow-y: scroll;
}

.tasks-container::-webkit-scrollbar {
  display: none;
}

/* Контейнер для задач */
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  width: 100%;
  max-width: 900px; /* Ограничиваем максимальную ширину задачи */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  overflow: hidden;
}

.task-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1; /* Расширяем текст, чтобы он использовал всё доступное место */
  margin-right: 15px; /* Отступ между текстом и кнопкой удаления */
}

.completed-task {
  text-decoration: line-through;
  color: gray;
}

.task-left {
  display: flex;
  align-items: center;
}

.task-left .check-icon {
  margin-right: 5px;
}

.task-left p {
  margin: 0;
  overflow-wrap: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 70%; /* Ограничение ширины текста */
}

/* Медиазапросы для респонсивности */
@media (max-width: 768px) {
  .task-left p {
    max-width: 60%;
  }
}

@media (max-width: 480px) {
  .task-left p {
    max-width: 50%;
  }
}

.task-right {
  display: flex;
  align-items: center;
}

.check-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.check-icon.completed {
  background-color: #28a745;
  border: none;
}

.check-icon.completed img {
  width: 20px;
  height: 20px;
}

.delete-icon .delete-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-icon img {
  width: 20px;
  height: 20px;
}

/* Кнопка добавления задачи */
.add-task-btn {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 60px;
  z-index: 1001;
}

@media (max-width: 650px) {
  .add-task-btn {
    right: 20px;
    left: auto;
    transform: none;
  }
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.modal button {
  margin: 10px;
  padding: 10px 20px;
}

.modal p {
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  max-width: 100%; /* Ограничим максимальную ширину текста */
  overflow-wrap: break-word;
}
</style>