<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="12%">
            <SideMenu ref="sideMenuRef"></SideMenu>
        </el-aside>
        <!-- chat left page -->
        <el-aside width="25%" class="chat-list">
            <!-- three categories of notifications -->
            <div class="notifications">
                <div class="notification" v-for="category of notificationCategories" :key="category">
                    <el-badge 
                        :hidden="$store.getters[category.name + 'NotificationManager'].unreadCount == 0" 
                        :value="$store.getters[category.name + 'NotificationManager'].unreadCount"
                    >
                        <el-button @click="goToView(category.name)" :type="category.type" round plain>
                            <el-icon>
                                <component :is="category.icon"></component>
                            </el-icon>
                        </el-button>
                    </el-badge>
                    <!-- descriptions -->
                    <div class="notification-description">{{ category.description }}</div>
                </div>
            </div>
            <!-- chat search box -->
            <el-input
                class="chat-search-box"
                placeholder="search for messages"
                clearable
            ></el-input>
            <!-- chat list -->
            <div style="margin-bottom: 8px;" v-for="chat in chatList" :key="chat">
                <ChatListBox
                    :chat-box-info="chat"
                    @go-chat="goChat(chat)"
                ></ChatListBox>
            </div>
        </el-aside>
        <!-- subpage -->
        <el-aside width="63%" class="chat-subpage">
            <!-- chat page -->
            <div v-if="currView == 'chat'">
                <ChatView
                    :chat="currChat"
                    @close-view="closeView"
                ></ChatView>
            </div>
            <!-- likes page -->
            <div v-else-if="currView == 'likes'">
                <LikeNotificationViewVue
                    @close-view="closeView"
                ></LikeNotificationViewVue>
            </div>
            <!-- follows page -->
            <div v-else-if="currView == 'follows'">
                <FollowNotificationView
                    @close-view="closeView"
                ></FollowNotificationView>
            </div>
            <!-- comments page -->
            <div v-else-if="currView == 'comments'">
                <CommentNotificationView
                    @close-view="closeView"
                ></CommentNotificationView>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import SideMenu from "../components/SideMenu.vue";
import ChatListBox from "../components/ChatListBox.vue";
import ChatView from "../components/ChatView.vue";
import CommentNotificationView from "../components/notifications/CommentNotificationView.vue";
import FollowNotificationView from "../components/notifications/FollowNotificationView.vue";
import LikeNotificationViewVue from "@/components/notifications/LikeNotificationView.vue";
import { HeartFilled, MessageFilled } from "@ant-design/icons-vue";
import axios from "axios";
import store from "@/store";
import { created } from "@/main.js";

const url = store.getters.url;

export default {
    name: "ChatPage",
    components: {
        SideMenu,
        ChatListBox,
        ChatView,
        HeartFilled,
        MessageFilled,
        CommentNotificationView,
        FollowNotificationView,
        LikeNotificationViewVue,
    },
    data() {
        return {
            notificationCategories: {
                likes: {
                    name: "likes",
                    type: "danger",
                    icon: "HeartFilled",
                    description: "Likes and Favorites"
                },
                follows: {
                    name: "follows",
                    type: "primary",
                    icon: "UserFilled",
                    description: "New Followers"
                },
                comments: {
                    name: "comments",
                    type: "success",
                    icon: "MessageFilled",
                    description: "Comments and Mentions"
                },
            },
            currView: "",
            currChat: null,
            chat: {
                "chatId": "chatId_",
                "chatType": "p2p",
                "appId": "appId_",
                "username": "username_",
                "avatar": "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg",
                "messages": [],
                "createdAt": "",
                "metadata": {},
                "unreadCount": 1,
            },
            chatList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(x => {
                const chat = {
                    "chatId": "chatId_",
                    "chatType": "p2p",
                    "appId": "5538e1372bb8454798147bb7293ac529",
                    "username": "username_",
                    "avatar": "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg",
                    "messages": [
  {
    "msgId": "msg1",
    "content": "这是第一条消息",
    "timestamp": "2023-10-01",
    "displayTime": "2023-10-01",
    "senderId": "5538e1372bb8454798147bb7293ac529",
    "avatar": "",
    "type": "img",
    "imgSrc": "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg",
  },
  
  {
    "msgId": "msg2",
    "content": "这是第二条消息",
    "timestamp": "2023-10-02",
    "displayTime": "2023-10-02",
    "senderId": "5538e1372bb8454798147bb7293ac529",
    "type": "text",
  },
  {
    "msgId": "msg3",
    "content": "你好呀",
    "timestamp": "2023-10-03",
    "displayTime": "2023-10-02",
    "senderId": "64af2195f02f4e1496c6e58969824ddb",
    "type": "text",
  }
],
                    "createdAt": "",
                    "metadata": {},
                    "unreadCount": x,
                };
                const c = JSON.parse(JSON.stringify(chat));
                c.chatId += x;
                c.username += x;
                if (x % 2 == 0) {
                    c.messages.pop();
                }
                return c;
            }),
            totalUnread: 0,
        }
    },
    methods: {
        goChat(chat) {
            this.$router.push("/chat?appId=" + chat.appId);
            this.currChat = chat;
        },
        countUnread(chats) {
            let count = 0;
            for (const chat of chats) {
                count += chat.unreadCount;
            }
            return count;
        },
        openChatView(appId) {
            this.currView = "chat";
            if (appId == null) {
                this.currChat = null;
                return;
            }
            for (const chat of this.chatList) {
                if (chat.appId == appId) {
                    this.currChat = chat;
                    break;
                }
            }
        },
        goToView(view) {
            this.currView = view;
            if (view == "follows") {
                if (this.$store.getters.followsNotificationManager.getUnreadCount() > 0) {
                    this.$store.getters.followsNotificationManager.list.map(x => x.read = true);
                    const ids = this.$store.getters.followsNotificationManager.list.filter(x => !x.read).map(x => x.notificationId).join(",");
                    axios.put(url + "/api/notifications/read-all?ids=" + ids);
                    this.$store.getters.followsNotificationManager.recountUnread();
                }
            } else if (view == "likes") {
                if (this.$store.getters.likesNotificationManager.getUnreadCount() > 0) {
                    this.$store.getters.likesNotificationManager.list.map(x => x.read = true);
                    const ids = this.$store.getters.likesNotificationManager.list.filter(x => !x.read).map(x => x.notificationId).join(",");
                    axios.put(url + "/api/notifications/read-all?ids=" + ids);
                    this.$store.getters.likesNotificationManager.recountUnread();
                }
            }
        },
        closeView() {
            if (this.currView == "chat") {
                this.currChat = null;
                this.$router.push("/chat");
            } else {
                this.currView = "chat";
            }
        },
        // initNotifications() {
        //     const fol = axios.get(url + "/api/notifications/follows?skip=0");
        //     const com = axios.get(url + "/api/notifications/comments?skip=0");
            
        //     Promise.all([fol, com]).then((responses) => {
        //         const { fol, com } = responses;
        //         console.log(fol, com);
        //         if (fol.data.code == 0) {
        //             store.getters.followsNotificationManager.init(fol.data.data);
        //         }
        //         if (com.data.code == 0) {
        //             store.getters.commentsNotificationManager.init(com.data.data);
        //         }
        //     })
        // },
    },
    async mounted() {
        await created();
        const appId = this.$route.query.appId;
        this.openChatView(appId);
        this.$watch("$route.query.appId", (appId, oldAppId) => {
            if (appId !== oldAppId) {
                this.openChatView(appId);
            }
        })
    },
}
</script>

<style scoped>
.container {
    height: 100vh;
}
.chat-list, .chat-subpage {
    /* margin-top: 30px; */
    margin-left: 2px;
    margin-right: 2px;
    padding-left: 4px;
    padding-right: 4px;
}
.chat-list {
    padding-top: 30px;
    padding-bottom: 30px;
}
.chat-search-box {
    margin-bottom: 20px;
}
.chat-subpage {
    padding-top: 30px;
}
.notifications {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 30px;
}
.notification {
    text-align: center;
    width: 30%;
}
.notification-description {
    font-size: 12px;
    white-space: pre-wrap;
    margin-top: 10px;
}
</style>
