import { createStore } from 'vuex';

export default createStore({
  state: {
    token: null,  // Изначально токен пустой
  },
  mutations: {
    setToken(state, token) {
      state.token = token;  // Сохраняем токен
    },
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);  // Сохраняем токен через mutation
    },
  },
  getters: {
    getToken(state) {
      return state.token;  // Получаем токен из состояния
    },
  },
});
