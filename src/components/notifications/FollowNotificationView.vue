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
    <div v-if="$store.getters.followsNotificationManager.list.length > 0" class="follow-notifications">
        <div v-for="notification of $store.getters.followsNotificationManager.list" :key="notification">
            <el-card class="follow-notification">
                <div class="topline">
                    <el-badge is-dot :hidden="notification.read">
                        <el-avatar :src="notification.fromUserAvatar" :size="40"></el-avatar>
                    </el-badge>
                    <div class="body">
                        <div style="display: flex; justify-content: space-between">
                            <div class="username">
                                {{ notification.fromUsername }}
                            </div>
                            <div style="display: flex;">
                                <div class="follow-button" v-if="notification.appId != user.appId">
                                    <el-button @click="follow(notification.appId)" v-if="!this.$store.getters.friendMap.get('follows').has(notification.appId)" type="danger" plain round size="small">
                                        Follow
                                        <el-icon><Plus /></el-icon>
                                    </el-button>
                                    <el-button @click="unfollow(notification.appId)" v-else type="info" plain round size="small">
                                        Followed
                                        <el-icon><Check /></el-icon>
                                    </el-button>
                                </div>
                                <el-button @click="deleteOne(notification.notificationId)" type="danger" plain style="border: none;" size="small">
                                    <el-icon><Close /></el-icon>
                                </el-button>
                            </div>
                        </div>
                        <div class="meta">
                            {{ 'started following you: ' + notification.dateTime }}
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <!-- expand more -->
        <div class="expand-more">
            <a-spin :spinning="pagination.loading">
                <el-button style="border: none;" @click="fetchNotifications()" class="expand-more" :disabled="!pagination.hasMore" v-text="pagination.placeholder"></el-button>
            </a-spin>
        </div>
    </div>
    <div v-else>
        <el-empty description="no notifications..."></el-empty>
    </div>
</template>

<script>
import store from "@/store";
import axios from "axios";
import { follow, unfollow } from "@/utils/methods/follows.js";
import { fetchNotifications } from "@/utils/methods/notifications.js";

const url = store.getters.url;

export default {
    emits: ["closeView"],
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")),
            pagination: {
                loading: false,
                hasMore: true,
                placeholder: "expand more....",
            },
        }
    },
    methods: {
        closeView() {
            this.$emit("closeView");
        },
        async fetchNotifications() {
            this.pagination.loading = true;
            const skip = this.$store.getters.followsNotificationManager.list.length;
            const res = await fetchNotifications("follows", skip);
            if (res.data.code == 0) {
                if (res.data.data.length == 0) {
                    this.pagination.hasMore = false;
                    this.pagination.loading = false;
                    this.pagination.placeholder = "no more notifications...";
                    return;
                }
                this.$store.getters.followsNotificationManager.pushAllFront(res.data.data);
            }
            this.pagination.loading = false;
        },
        readAll() {
            if (this.$store.getters.followsNotificationManager.getUnreadCount() > 0) {
                const ids = this.$store.getters.followsNotificationManager.list.map(x => x.notificationId).join(",");
                axios.put(url + "/api/notifications/read-all?ids=" + ids);
                this.$store.getters.followsNotificationManager.list.map(x => x.read = true);
            }
        },
        clearAll() {
            const ids = this.$store.getters.followsNotificationManager.list.map(x => x.notificationId).join(",");
            if (ids.trim() != "") {
                axios.delete(url + "/api/notifications/clear-all?ids=" + ids);
                this.$store.getters.followsNotificationManager.clear();
            }
        },
        deleteOne(id) {
            axios.delete(url + "/api/notifications/clear-all?ids=" + id);
            this.$store.getters.followsNotificationManager.delete(id);
        },
        follow(notification) {
            follow(notification);
        },
        unfollow(notification) {
            unfollow(notification);
        },
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
.follow-notifications {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 50px;
}
.follow-notification {
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
.follow-button {
    margin-right: 10px;
}
.expand-more {
    width: 100%;
    margin-top: 10px;
}
</style>
