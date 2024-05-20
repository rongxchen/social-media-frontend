<template>
    <div style="width: 100%; height: 100%;">
        <span v-if="(lastMsgDisplayTime && lastMsgDisplayTime != message.displayTime) || !lastMsgDisplayTime" class="message-date">
            {{ '2020-01-01' }}
        </span>
        <!-- for sender -->
        <div class="message-box left-box" v-if="message.senderId != user.appId">
            <el-avatar class="message-avatar-left" :src="message.avatar" :size="35"></el-avatar>
            <div :style="{'background-color': messageLeftColor}" class="message-content-left">
                <div class="message-body">
                    <!-- if text -->
                    <div v-if="message.type == 'text'">
                        <span class="message-text">{{ message.content + '\nqqq' }}</span>
                    </div>
                    <!-- if img -->
                    <div v-if="message.type == 'img'" class="message-img" @click="previewImg(message.imgSrc)">
                        <img :src="message.imgSrc" />
                    </div>
                </div>
            </div>
        </div>
        <!-- for me -->
        <div class="message-box right-box" v-else>
            <div class="message-content-right">
                <div class="message-body">
                    <!-- if text -->
                    <div v-if="message.type == 'text'">
                        <span class="message-text">{{ message.content }}</span>
                    </div>
                    <!-- if img -->
                    <div v-if="message.type == 'img'" class="message-img" @click="previewImg(message.imgSrc)">
                        <img :src="message.imgSrc" />
                    </div>
                </div>
            </div>
            <el-avatar class="message-avatar-right" :src="message.avatar"></el-avatar>
        </div>
        <!-- img preview dialog -->
        <el-dialog
            v-model="msgImgPreview.visible"
            @close="() => {this.msgImgPreview.visible = false; this.msgImgPreview.imgSrc = ''}" 
        ><div class="preview-img">
            <img :src="msgImgPreview.imgSrc" />
        </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    props: ["message", "user", "positionStyle", "lastMsgDisplayTime"],
    data() {
        return {
            greyForDark: "#4b4b4b",
            greyForLight: "lightgrey",
            messageLeftColor: null,
            msgImgPreview: {
                imgSrc: "",
                visible: false,
            }
        }
    },
    methods: {
        previewImg(imgSrc) {
            this.msgImgPreview.imgSrc = imgSrc;
            this.msgImgPreview.visible = true;
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
.message-text {
    white-space: pre-wrap;
}
.message-img img {
    max-width: 150px;
    max-height: 150px;
}
.preview-img {
    display: grid;
    place-items: center;
}
.preview-img img {
    max-width: 400px;
    max-height: 350px;
}
.message-date {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    color: #888888;
    font-size: 12px;
}
</style>