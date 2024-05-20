<template>
    <div :style="selectedStyle" class="chat-box">
        <div class="chat-avatar">
            <el-avatar :src="chatBoxInfo.avatar" :size="40"></el-avatar>
        </div>
        <div @click="goChat" class="chat-info">
            <div class="chat-username">
                <div> 
                    <span class="chat-displayname" :style="textOverflowEllipsisStyle">{{ chatBoxInfo.username }}</span>
                </div>
                <div>
                    <span class="chat-last-msg" :sytle="textOverflowEllipsisStyle">{{ chatBoxInfo.messages[chatBoxInfo.messages.length-1].content }}</span>
                </div>
            </div>
            <div>
                <div class="chat-date">
                    {{ chatBoxInfo.messages[chatBoxInfo.messages.length-1].timestamp }}
                </div>
                <div class="chat-unread">
                    <el-tag round type="danger" style="border: none" size="small">
                        {{ chatBoxInfo.unreadCount }}
                    </el-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["chatBoxInfo"],
    emits: ["go-chat"],
    data() {
        return {
            textOverflowEllipsisStyle: {
                "display": "-webkit-box",
                "-webkit-line-clamp": "1",
                "-webkit-box-orient": "vertical",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
            },
            lightGreyStyle: {
                "opacity": "0.8",
                "color": "#409EFF",
                "font-weight": "900",
            },
            selectedStyle: {},
        }
    },
    methods: {
        goChat() {
            this.$emit("go-chat");
        }
    },
    mounted() {
        this.selectedStyle = this.$route.query.chatId && this.$route.query.chatId == this.chatBoxInfo.chatId ? this.lightGreyStyle : {};
        this.$watch("$route.query.chatId", (newVal) => {
            if (newVal) {
                if (newVal == this.chatBoxInfo.chatId) {
                    this.selectedStyle = this.lightGreyStyle;
                } else {
                    this.selectedStyle = {};
                }
            } else {
                this.selectedStyle = {};
            }
        })
    }
}
</script>

<style scope>
.chat-box {
    margin-right: 5px;
    margin-bottom: 5px;
    display: flex;
    border-radius: 8px;
    padding: 4px;
}
.chat-avatar {
    width: 20%;
}
.chat-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.chat-username {
    width: 60%;
    margin-left: 10px;
}
.chat-date {
    color: #888888;
    font-size: 13px;
}
.chat-displayname, .chat-last-msg {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
.chat-last-msg {
    color: #888888;
}
.chat-unread {
    display: flex; 
    justify-content: end;
    margin-top: 5px;
}
</style>