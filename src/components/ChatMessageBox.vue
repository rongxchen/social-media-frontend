<template>
    <!-- for sender -->
    <div style="width: 100%; height: 100%;">
        <div class="message-box left-box" v-if="message.senderId != user.appId">
            <el-avatar class="message-avatar-left" :src="message.avatar" :size="35"></el-avatar>
            <div :style="{'background-color': messageLeftColor}" class="message-content-left">
                {{ message.content }}
            </div>
        </div>
        <!-- for me -->
        <div class="message-box right-box" v-else>
            <div class="message-content-right">
                {{ message.content }}
            </div>
            <el-avatar class="message-avatar-right" :src="message.avatar"></el-avatar>
        </div>
    </div>
</template>

<script>

export default {
    props: ["message", "user", "positionStyle"],
    data() {
        return {
            greyForDark: "#4b4b4b",
            greyForLight: "lightgrey",
            messageLeftColor: null,
        }
    },
    mounted() {
        this.messageLeftColor = this.$store.getters.theme ? this.greyForDark : this.greyForLight;
        this.$watch("$store.getters.theme", (newVal) => {
            if (newVal) {
                this.messageLeftColor = this.greyForDark;
            } else {
                this.messageLeftColor = this.greyForLight;
            }
        })
    }
}
</script>

<style setup>
.message-box {
    width: 100%;
    display: flex;
    align-items: center;
}
.left-box {
    justify-content: flex-start;
}
.right-box {
    justify-content: flex-end;
}
.message-avatar-left {
    margin-right: 10px;
}
.message-avatar-right {
    margin-left: 10px;
}
.message-content-left {
    padding: 5px;
    border-radius: 4px;
    margin-top: auto;
    margin-bottom: auto;
}
.message-content-right {
    padding: 5px;
    border-radius: 4px;
    background-color: rgb(21, 148, 190);
    margin-top: auto;
    margin-bottom: auto;
    color: white;
}
</style>