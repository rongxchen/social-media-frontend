import { createStore } from "vuex";
import { useDark } from '@vueuse/core';

export default createStore({
  state: {
    url: "http://localhost:8080",
    theme: useDark(),
    greyColor: "#888888",
  },
  getters: {
    url: (state) => state.url,
    theme: (state) => state.theme,
    greyColor: (state) => state.greyColor,
  },
  mutations: {
    changeTheme(state) {
      state.theme = !state.theme;
    },
  },
  actions: {
  },
  computed: {
  },
  modules: {
  }
})
