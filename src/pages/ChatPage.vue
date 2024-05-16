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
                    <div class="chat-unread-count">{{'new messages: ' + 2}}</div>
                    <!-- chat search box -->
                    <el-input
                        class="chat-search-box"
                        placeholder="search for messages"
                        clearable
                    ></el-input>
                    <!-- chat list -->
                    <div v-for="chat in chatList" :key="chat">
                        <ChatListBox
                            :chat-box-info="chat"
                        ></ChatListBox>
                    </div>
                </el-aside>
                <!-- chat subpage -->
                <el-aside class="chat-subpage">
                    <span>hello</span>
                </el-aside>
            </el-container>
        </el-aside>
    </el-container>
</template>

<script>
import SideMenu from "../components/SideMenu.vue";
import ChatListBox from "../components/ChatListBox.vue"

export default {
    name: "ChatPage",
    components: {
        SideMenu,
        ChatListBox,
    },
    data() {
        return {
            chatList: [
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 1", messages: ["hello, ", "worldworldworld 1 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 2", messages: ["hello, ", "world 2 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 3", messages: ["hello, ", "world 3 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 4", messages: ["hello, ", "world 4 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 5", messages: ["hello, ", "world 5 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 6", messages: ["hello, ", "world 6 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 1", messages: ["hello, ", "world 1 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 2", messages: ["hello, ", "world 2 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 3", messages: ["hello, ", "world 3 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 4", messages: ["hello, ", "world 4 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 5", messages: ["hello, ", "world 5 😊"]},
                {avatar: "https://myappsocialmediastorage.blob.core.windows.net/media/users/avatar/d763c5b89af540a0be1c0311152212c1.jpg", username: "user 6", messages: ["hello, ", "world 6 😊"]},
            ],
        }
    },
    methods: {
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
    display: flex;
    justify-content: space-between;
    height: 100vh;
}
.chat-list {
    width: 25%;
}
.chat-unread-count {
    margin-bottom: 15px;
    text-align: center;
}
.chat-search-box {
    width: 99%;
    margin-bottom: 20px;
}
.chat-subpage {
    width: 74.5%;
}
</style>
