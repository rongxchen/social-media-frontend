<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="12%">
            <SideMenu ref="sideMenuRef"></SideMenu>
        </el-aside>
        <!-- chat left page -->
        <el-aside width="23%" class="chat-list">
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
        <el-aside width="65%" class="chat-subpage">
            <ChatView
                :chat="currChat"
            ></ChatView>
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
    "displayTime": "2023-10-01",
    "senderId": "appId_1",
    "avatar": "",
    "type": "img",
    "imgSrc": "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg",
  },
  
  {
    "msgId": "msg2",
    "content": "这是第二条消息",
    "timestamp": "2023-10-02",
    "displayTime": "2023-10-02",
    "senderId": "appId_1",
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
            this.$router.push("/chat?chatId=" + chat.chatId);
            this.currChat = chat;
        },
        countUnread(chats) {
            let count = 0;
            for (const chat of chats) {
                count += chat.unreadCount;
            }
            return count;
        }
    },
    mounted() {
        const chatId = this.$route.query.chatId;
        if (chatId) {
            for (const chat of this.chatList) {
                if (chat.chatId == chatId) {
                    this.currChat = chat;
                    break;
                }
            }
        }
        this.totalUnreadCount = this.countUnread(this.chatList);
        this.$refs.sideMenuRef.updateChatBadgeCount(this.totalUnreadCount);
    }
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
}
.chat-search-box {
    margin-bottom: 20px;
}
.chat-subpage {
    padding-top: 30px;
}
</style>
