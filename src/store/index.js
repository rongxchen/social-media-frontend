import { createStore } from "vuex";
import { useDark } from '@vueuse/core';

export default createStore({
  state: {
    url: "http://localhost:8080",
    theme: useDark(),
    greyColor: "#888888",
    likeMap: new Map(),
    currPost: {},
  },
  getters: {
    url: (state) => state.url,
    theme: (state) => state.theme,
    greyColor: (state) => state.greyColor,
    likeMap: (state) => state.likeMap,
    currPost: (state) => state.currPost,
  },
  mutations: {
    changeTheme(state) {
      state.theme = !state.theme;
    },
    changeCurrPost(state, post) {
      state.currPost = post;
    }
  },
  actions: {
  },
  computed: {
  },
  modules: {
  }
})
