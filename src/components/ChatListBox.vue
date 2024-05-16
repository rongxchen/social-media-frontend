<template>
    <div class="chat-box">
        <div class="chat-avatar">
            <el-avatar :src="chatBoxInfo.avatar" :size="40"></el-avatar>
        </div>
        <div @click="goChat" class="chat-info">
            <div class="chat-username">
                <div> 
                    <span class="chat-displayname" :style="textOverflowEllipsisStyle">{{ chatBoxInfo.username }}</span>
                </div>
                <div>
                    <span class="chat-last-msg" :sytle="textOverflowEllipsisStyle">{{ chatBoxInfo.messages[chatBoxInfo.messages.length-1] }}</span>
                </div>
            </div>
            <div>
                <div class="chat-date">2023-01-01</div>
                <div class="chat-unread">
                    <el-tag round type="danger" style="border: none" size="small">1</el-tag>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["chatBoxInfo"],
    data() {
        return {
            textOverflowEllipsisStyle: {
                "display": "-webkit-box",
                "-webkit-line-clamp": "1",
                "-webkit-box-orient": "vertical",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
            }
        }
    },
    methods: {
        goChat() {
            this.$router.push("/chat?appId=" + this.chatBoxInfo.username);
        }
    }
}
</script>

<style scope>
.chat-box {
    margin-right: 5px;
    margin-bottom: 20px;
    display: flex;
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