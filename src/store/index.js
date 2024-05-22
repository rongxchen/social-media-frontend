import { createStore } from "vuex";
import { useDark } from '@vueuse/core';
import { ChatManager, LikesNotificationManager, FollowsNotificationManager, CommentsNotificationManager } from "@/utils/chat_manager";

export default createStore({
  state: {
    // url: "http://192.168.0.196:8080",
    url: "http://localhost:8080",
    theme: useDark(),
    greyColor: "#888888",
    likeMap: new Map([["likes", new Map()], ["favorites", new Map()], ["comment-likes", new Map()]]),
    friendMap: new Map([["followers", new Map()], ["follows", new Map()]]),
    chatManager: new ChatManager(),
    likesNotificationManager: new LikesNotificationManager(),
    followsNotificationManager: new FollowsNotificationManager(),
    commentsNotificationManager: new CommentsNotificationManager(),
  },
  getters: {
    url: (state) => state.url,
    theme: (state) => state.theme,
    greyColor: (state) => state.greyColor,
    likeMap: (state) => state.likeMap,
    friendMap: (state) => state.friendMap,
    chatManager: (state) => state.chatManager,
    likesNotificationManager: (state) => state.likesNotificationManager,
    followsNotificationManager: (state) => state.followsNotificationManager,
    commentsNotificationManager: (state) => state.commentsNotificationManager,
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
