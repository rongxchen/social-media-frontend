<template>
    <div ref="chatMsgListRef" v-if="chatInfo && Object.keys(chatInfo).length > 0" class="chat-view-container">
        <div class="chat-topline">
            <el-button @click="closeChatView" class="chat-back">
                <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <el-avatar class="chat-avatar" :src="chatInfo.avatar" :size="35"></el-avatar>
            <div class="chat-username">{{ chatInfo.username }}</div>
        </div>
        <div class="chat-messages">
            <div v-if="chatInfo.messages.length > 0">
                <div v-for="i in chat.messages.length" :key="i">
                    <div class="chat-message">
                        <!-- chat content -->
                        <ChatMessageBox
                            :message="chat.messages[i-1]"
                            :user="userInfo"
                            :last-msg-display-time="i == 1 ? null : chat.messages[i-1-1].displayTime"
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
                <el-input @keyup.enter="sendMessage" v-model="msgInput.content" clearable class="chat-input"></el-input>
                <div v-if="msgInput.content.trim() !== ''">
                    <el-button type="primary" @click="sendMessage" class="chat-send-button">
                        <el-icon><Promotion /></el-icon>
                    </el-button>
                </div>
                <div v-else>
                    <el-dropdown>
                        <el-button type="info" class="chat-send-button">
                            <el-icon><Plus /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <!-- image -->
                                <el-dropdown-item>
                                    <el-icon><Picture /></el-icon>
                                    Image
                                </el-dropdown-item>
                                <!-- video -->
                                <el-dropdown-item>
                                    <el-icon><VideoPlay /></el-icon>
                                    Videos
                                </el-dropdown-item>
                                <!-- audio -->
                                <el-dropdown-item>
                                    <el-icon><Headset /></el-icon>
                                    Audios
                                </el-dropdown-item>
                                <!-- files -->
                                <el-dropdown-item>
                                    <el-icon><Files /></el-icon>
                                    Files
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
    <div ref="chatMsgListRef" v-else>
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
            msgInput: {
                content: "",
            },
        }
    },
    methods: {
        sendMessage() {
            this.msgInput.content = this.msgInput.content.trim();
            if (this.msgInput.content == "") {
                this.$message.warning("message content cannot be empty");
                return;
            }
            this.chatInfo.messages.push({"msgId": "m1", 
                "content": this.msgInput.content, 
                "displayTime": "now",
                "type": "text",
                "senderId": this.userInfo.appId})
            this.msgInput.content = "";
        },
        closeChatView() {
            this.$router.push("/chat");
        },
    },
    mounted() {
        this.$watch("chat", (newVal) => {
            this.chatInfo = newVal;
        })
        setTimeout(() => {
            this.scrollToBottom = () => {
                this.$refs.chatMsgListRef.scrollTop = this.$refs.chatMsgListRef.scrollHeight;
            }
            this.scrollToBottom();
            this.$watch("chatInfo.messages.length", () => {
                this.$nextTick(() => {
                    this.scrollToBottom();
                })
            })
        }, 100);
    },
}
</script>

<style scoped>
.chat-view-container {
    padding-left: 20px;
    padding-right: 20px;
    overflow-y: auto;
    height: 450px;
}
.chat-topline {
    position: fixed;
    display: flex;
    align-items: center;
    height: 60px;
    width: 500px;
    z-index: 999;
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
.chat-messages {
    padding-top: 50px;
    position: relative;
    z-index: 1;
}
.chat-message {
    display: flex;
    margin-bottom: 20px;
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
.chat-back {
    margin-right: 15px;
    border: none;
}
</style>