import { createStore } from "vuex";
import { useDark } from '@vueuse/core';

export default createStore({
  state: {
    url: "http://localhost:8080",
    theme: useDark(),
    greyColor: "#888888",
    likeMap: null,
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
    },
    resetLikeMap(state, likeMap) {
      state.likeMap = new Map();
      Object.keys(likeMap).forEach(k => {
        state.likeMap.set(k, 1);
      })
    }
  },
  actions: {
  },
  computed: {
  },
  modules: {
  }
})
