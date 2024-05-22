<template>
    <div class="buttons">
        <div>
            <el-button @click="closeView" class="chat-back">
                <el-icon><ArrowLeft /></el-icon>
            </el-button>
        </div>
        <div class="operation-buttons">
            <el-button @click="readAll" type="primary" plain round>
                read all
                <el-icon><Check /></el-icon>
            </el-button>
            <el-button @click="clearAll" type="danger" plain round>
                clear all
                <el-icon><Check /></el-icon>
            </el-button>
        </div>
    </div>
    <div v-if="$store.getters.commentsNotificationManager.list.length > 0" class="comment-notifications">
        <div v-for="notification of $store.getters.commentsNotificationManager.list" :key="notification">
            <el-card class="comment-notification">
                <div class="topline">
                    <el-badge is-dot :hidden="notification.read">
                        <el-avatar :src="notification.fromUserAvatar" :size="40"></el-avatar>
                    </el-badge>
                    <div class="body">
                        <div style="display: flex; justify-content: space-between">
                            <div class="username">
                                {{ notification.fromUsername }}
                                <span v-if="true || notification.isAuthor">
                                    <el-tag effect="plain" size="small" round>author</el-tag>
                                </span>
                            </div>
                            <el-button @click="deleteOne(notification.notificationId)" type="danger" plain style="border: none;" size="small">
                                <el-icon><Close /></el-icon>
                            </el-button>
                        </div>
                        <div class="meta">{{ 'replied to you: ' + notification.dateTime }}</div>
                        <div @click="openPostDetail(notification)" class="content">{{ notification.commentContent }}</div>
                    </div>
                </div>
                <!-- <el-card class="post-title">
                    <div>{{ notification.postTitle }}</div>
                </el-card> -->
            </el-card>
            <!-- open post detail container -->
            <el-drawer :with-header="false" size="60%" v-model="postDetail.visible" :before-close="() => {this.postDetail.visible = false;}">
                <PostDetailContainer
                    :curr-post="postDetail.currPost"
                    @like-post="likePost"
                    @favorite-post="favoritePost"
                    @close-drawer="closeDrawer"
                ></PostDetailContainer>
            </el-drawer>
        </div>
    </div>
    <div v-else>
        <el-empty description="no notifications..."></el-empty>
    </div>
</template>

<script>
import PostDetailContainer from "../PostDetailContainer.vue";
import { likePost, favoritePost } from "@/utils/methods/posts.js";
import axios from "axios";
import store from "@/store";

const url = store.getters.url;

export default {
    emits: ["closeView"],
    components: {
        PostDetailContainer,
    },
    data() {
        return {
            postDetail: {
                currPost: null,
                visible: false,
            }
        }
    },
    methods: {
        closeView() {
            this.$emit("closeView");
        },
        likePost(post) {
            likePost(post);
        },
        favoritePost(post) {
            favoritePost(post);
        },
        closeDrawer() {
            this.postDetail.visible = false;
        },
        openPostDetail(notification) {
            this.postDetail.visible = true;
            axios.get(url + "/api/posts/" + notification.postId).then((res) => {
                if (res.data.code == 0) {
                    this.postDetail.currPost = res.data.data;
                }
            })
            if (!notification.read) {
                axios.put(url + "/api/notifications/read-all?ids=" + notification.notificationId);
                notification.read = true;
            }
        },
        readAll() {
            if (this.$store.getters.commentsNotificationManager.getUnreadCount() > 0) {
                const ids = this.$store.getters.commentsNotificationManager.list.map(x => x.notificationId).join(",");
                axios.put(url + "/api/notifications/read-all?ids=" + ids);
                this.$store.getters.commentsNotificationManager.list.map(x => x.read = true);
            }
        },
        clearAll() {
            const ids = this.$store.getters.commentsNotificationManager.list.map(x => x.notificationId).join(",");
            if (ids.trim() != "") {
                axios.delete(url + "/api/notifications/clear-all?ids=" + ids);
                this.$store.getters.commentsNotificationManager.clear();
            }
        },
        deleteOne(id) {
            axios.delete(url + "/api/notifications/clear-all?ids=" + id);
            this.$store.getters.commentsNotificationManager.delete(id);
        }
    },
}
</script>

<style scoped>
.chat-back {
    margin-left: 20px;
    border: none;
}
.buttons {
    display: flex;
}
.operation-buttons {
    margin-left: 20px;
}
.comment-notifications {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 50px;
}
.comment-notification {
    width: 100%;
    margin-top: 20px;
}
.topline {
    display: flex;
    width: 100%;
}
.body {
    margin-left: 15px;
    width: 100%;
}
.meta {
    color: #888888;
    font-size: 12px;
}
.content {
    margin-top: 5px;
    font-size: 16px;
}
.post-title {
    margin-top: 10px;
}
</style>
