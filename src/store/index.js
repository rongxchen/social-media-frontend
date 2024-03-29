import { createStore } from "vuex";
import { useDark } from '@vueuse/core';

export default createStore({
  state: {
    url: "http://localhost:8080",
    theme: useDark(),
    greyColor: "#888888",
    likeMap: new Map(),
  },
  getters: {
    url: (state) => state.url,
    theme: (state) => state.theme,
    greyColor: (state) => state.greyColor,
    likeMap: (state) => state.likeMap,
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
