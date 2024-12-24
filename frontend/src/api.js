import axios from 'axios';

const API_URL = 'http://localhost:8001/api/';

export default {
  // Вход в систему (получение токена)
  login(userData) {
    return axios.post(`${API_URL}jwt/create/`, userData);
  },

  // Регистрация пользователя
  register(userData) {
    return axios.post(`${API_URL}users/`, userData);
  },

  // Получение задач
  getTasks(token) {
    return axios.get('http://localhost:8001/tasks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Создание задачи
  createTask(taskData, token) {
    return axios.post('http://localhost:8001/tasks', taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Редактирование задачи
  updateTask(taskId, taskData, token) {
    return axios.put(`http://localhost:8001/tasks/${taskId}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Удаление задачи
  deleteTask(taskId, token) {
    return axios.delete(`http://localhost:8001/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Получение информации о пользователе
  getUserInfo(token) {
    return axios.get(`${API_URL}users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
};
