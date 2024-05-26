import { createStore } from "vuex";
import { useDark } from '@vueuse/core';
import { ChatManager, LikesNotificationManager, FollowsNotificationManager, CommentsNotificationManager } from "@/utils/chat_manager";
import WebsocketUtil from "@/utils/websocket_util";
import { ElNotification } from "element-plus";

export default createStore({
  state: {
    // url: "http://192.168.0.196:8080",
    url: "http://localhost:8080",
    wsUrl: "ws://localhost:8080",
    theme: useDark(),
    greyColor: "#888888",
    likeMap: null,
    friendMap: null,
    chatManager: new ChatManager(),
    likesNotificationManager: new LikesNotificationManager(),
    followsNotificationManager: new FollowsNotificationManager(),
    commentsNotificationManager: new CommentsNotificationManager(),
    ws: null,
  },
  getters: {
    url: (state) => state.url,
    wsUrl: (state) => state.wsUrl,
    theme: (state) => state.theme,
    greyColor: (state) => state.greyColor,
    likeMap: (state) => state.likeMap,
    friendMap: (state) => state.friendMap,
    chatManager: (state) => state.chatManager,
    likesNotificationManager: (state) => state.likesNotificationManager,
    followsNotificationManager: (state) => state.followsNotificationManager,
    commentsNotificationManager: (state) => state.commentsNotificationManager,
    ws: (state) => state.ws,
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
    initWs(state) {
      const wsUrl = state.wsUrl + "/ws/chat";
      state.ws = new WebsocketUtil(wsUrl, (msg) => {
        if (msg == "token expired") {
          ElNotification({
            message: "token expired, please login again",
            duration: 2500,
            type: "info"
          })
          return;
        }
        const notification = JSON.parse(msg);
        const topic = notification.topic;
        const data = notification.data;
        if (topic == "likesNotification") {
          state.likesNotificationManager.pushItemFront(data);
        } else if (topic == "followsNotification") {
          state.followsNotificationManager.pushItemFront(data);
        } else if (topic == "commentsNotification") {
          state.commentsNotificationManager.pushItemFront(data);
        }
        ElNotification({
          message: "got a new message",
          duration: 2500,
          type: "warning"
        })
      })
    },
    destroyWs(state) {
      if (state.ws) {
        state.ws.disconnect();
        state.ws = null;
      }
    }
  },
  actions: {
  },
  computed: {
  },
  modules: {
  }
})
