<template>
    <div v-if="chatInfo && Object.keys(chatInfo).length > 0" class="chat-view-container">
        <div class="chat-topline">
            <el-avatar class="chat-avatar" :src="chatInfo.avatar" :size="35"></el-avatar>
            <div class="chat-username">{{ chatInfo.username }}</div>
        </div>
        <div class="chat-messages">
            <div v-if="chatInfo.messages.length > 0">
                <div v-for="message of chat.messages" :key="message">
                    <div class="chat-message">
                        <!-- chat content -->
                        <ChatMessageBox
                            :message="message"
                            :user="userInfo"
                        ></ChatMessageBox>
                    </div>
                </div>
            </div>
            <div v-else>
                <el-empty></el-empty>
            </div>
        </div>
        <!-- input -->
        <div class="chat-send-container">
            <div class="chat-send">
                <el-input clearable class="chat-input"></el-input>
                <el-button class="chat-send-button">
                    <el-icon><Promotion /></el-icon>
                </el-button>
            </div>
        </div>
    </div>
    <div v-else>
        <el-empty description=""></el-empty>
    </div>
</template>

<script>
import ChatMessageBox from "./ChatMessageBox.vue";

export default {
    props: ["chat"],
    components: {
        ChatMessageBox,
    },
    data() {
        return {
            userInfo: JSON.parse(localStorage.getItem("userInfo")),
            chatInfo: this.chat,
        }
    },
    mounted() {
        this.$watch("chat", (newVal) => {
            if (newVal) {
                this.chatInfo = newVal;
            }
        })
    },
}
</script>

<style scoped>
.chat-view-container {
    padding-left: 20px;
    padding-right: 20px;
}
.chat-topline {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}
.chat-username {
    display: flex;
    font-size: 16px;
    margin-top: auto;
    margin-bottom: auto;
}
.chat-avatar {
    margin-top: auto;
    margin-bottom: auto;
}
.chat-message {
    display: flex;
    margin-bottom: 10px;
}
.chat-send-container {
    position: fixed;
    bottom: 0;
    width: 58%;
    margin-bottom: 5px;
}
.chat-send {
    display: flex;
    justify-content: center;
}
.chat-input {
    width: 100%;
}
.chat-send-button {
    margin-left: 5px;
}
</style>