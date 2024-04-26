import { createStore } from "vuex";
import { useDark } from '@vueuse/core';

export default createStore({
  state: {
    // url: "http://localhost:8080",
    url: "https://social-media-backend.azurewebsites.net",
    theme: useDark(),
    greyColor: "#888888",
    likeMap: null,
    friendMap: null,
  },
  getters: {
    url: (state) => state.url,
    theme: (state) => state.theme,
    greyColor: (state) => state.greyColor,
    likeMap: (state) => state.likeMap,
    friendMap: (state) => state.friendMap,
  },
  mutations: {
    changeTheme(state) {
      state.theme = !state.theme;
    },
    resetLikeMap(state, likeMap) {
      state.likeMap = new Map();
      Object.keys(likeMap).forEach(k => {
        state.likeMap.set(k, new Map());
        for (const id of likeMap[k]) {
          state.likeMap.get(k).set(id, 1);
        }
      })
    },
    resetFriendMap(state, friendMap) {
      state.friendMap = new Map();
      Object.keys(friendMap).forEach(k => {
        state.friendMap.set(k, new Map());
        for (const id of friendMap[k]) {
          state.friendMap.get(k).set(id, 1);
        }
      })
    },
    addFollows(state, id) {
      state.friendMap.get("follows").set(id, 1);
    },
    removeFollows(state, id) {
      state.friendMap.get("follows").delete(id);
    },
  },
  actions: {
  },
  computed: {
  },
  modules: {
  }
})
