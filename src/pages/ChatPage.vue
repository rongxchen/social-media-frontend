<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="15%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="85%">
            <el-container class="right-side-page">
                <!-- chat left page -->
                <el-aside class="chat-list">
                    <!-- unread message -->
                    <div class="chat-unread-count">{{'new messages: ' + totalUnread}}</div>
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
                <!-- chat subpage -->
                <el-aside class="chat-subpage">
                    <ChatView
                        :chat="currChat"
                    ></ChatView>
                </el-aside>
            </el-container>
        </el-aside>
    </el-container>
</template>

<script>
import SideMenu from "../components/SideMenu.vue";
import ChatListBox from "../components/ChatListBox.vue"
import ChatView from "../components/ChatView.vue"

export default {
    name: "ChatPage",
    components: {
        SideMenu,
        ChatListBox,
        ChatView,
    },
    data() {
        return {
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
                    "appId": "appId_",
                    "username": "username_",
                    "avatar": "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg",
                    "messages": [
  {
    "msgId": "msg1",
    "content": "这是第一条消息",
    "timestamp": "2023-10-01",
    "senderId": "appId_1",
    "avatar": ""
  },
  {
    "msgId": "msg2",
    "content": "这是第二条消息",
    "timestamp": "2023-10-02",
    "senderId": "appId_1"
  },
  {
    "msgId": "msg3",
    "content": "你好呀",
    "timestamp": "2023-10-03",
    "senderId": "64af2195f02f4e1496c6e58969824ddb"
  }
],
                    "createdAt": "",
                    "metadata": {},
                    "unreadCount": x,
                };
                const c = JSON.parse(JSON.stringify(chat));
                c.appId += x;
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
            this.totalUnread = 0;
            for (const chat of chats) {
                this.totalUnread += chat.unreadCount;
            }
        }
    },
    mounted() {
        const appId = this.$route.query.appId;
        if (appId) {
            for (const chat of this.chatList) {
                if (chat.appId == appId) {
                    this.currChat = chat;
                    break;
                }
            }
        }
        this.countUnread(this.chatList);
    }
}
</script>

<style scoped>
.container {
    height: 100vh;
}
.right-side-page {
    margin-top: 30px;
    margin-left: 2px;
    margin-right: 2px;
    padding-left: 4px;
    padding-right: 4px;
    display: flex;
    justify-content: space-between;
    height: 100vh;
}
.chat-list {
    width: 25%;
}
.chat-unread-count {
    margin-bottom: 10px;
    text-align: center;
}
.chat-search-box {
    margin-bottom: 10px;
}
.chat-subpage {
    width: 74.5%;
}
</style>
