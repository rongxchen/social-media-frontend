<template>
    <div class="user-detail-container">
        <div v-if="userInfo">
            <div class="user-topline">
                <!-- back arrow -->
                <el-button style="border: none" @click="closeDrawer">
                    <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <div class="user-desc">
                    <!-- avatar -->
                    <el-avatar :src="userInfo.avatar"></el-avatar>
                    <div class="user-desc-personal">
                        <div class="user-desc-name-and-appid">
                            <!-- username -->
                            <div class="user-desc-name"> 
                                {{ userInfo.username }} 
                            </div>
                            <!-- appid -->
                            <div :style="greyTextStyle"> {{ 'appId: ' + userInfo.appId }} </div>
                        </div>
                    </div>
                </div>
                <!-- description -->
                <div class="user-desc-item">
                    {{ userInfo.description }}
                </div>
                <!-- sex -->
                <div class="user-desc-item">
                    <el-tag size="small" round type="info" style="border: none; background-color: transparent; margin-right: 5px;" v-if="userInfo.sex != null && userInfo.sex != '' && userInfo.sex != 'N/A'">
                        <div v-if="userInfo.sex == 'M'">
                            <el-icon style="background-color: lightblue;"><Male /></el-icon>
                        </div>
                        <div v-else-if="userInfo.sex == 'F'">
                            <el-icon style="background-color: lightpink;"><Female /></el-icon>
                        </div>
                    </el-tag>
                    <el-tag :type="userInfo.sex == 'M'? 'primary' : (userInfo.sex == 'F' ? 'danger' : 'info')" style="border: none;" size="small" round>
                        {{ userInfo.age + ' years old' }}
                    </el-tag>
                </div>
                <!-- following info -->
                <div class="user-desc-item user-desc-following">
                    <span class="user-desc-following">
                        <div class="user-desc-following-item" v-for="info in ['Follows', 'Followers']" :key="info">
                            <div> {{ userInfo[info.toLocaleLowerCase()] || 0 }} </div>
                            <div> {{ info }} </div>
                        </div>
                    </span>
                    <div v-if="userInfo.appId != user.appId">
                        <el-button @click="follow(userInfo.appId)" v-if="!this.$store.getters.friendMap.get('follows').has(userInfo.appId)" type="danger" plain round size=small>
                            Follow
                            <el-icon><Plus /></el-icon>
                        </el-button>
                        <el-button @click="unfollow(userInfo.appId)" v-else type="info" plain round size="small">
                            Followed
                            <el-icon><Check /></el-icon>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <el-empty description="user does not exist"></el-empty>
        </div>
    </div>
</template>

<script>
import store from "@/store";
import axios from "axios";
import { follow, unfollow } from "@/utils/methods/follows.js";

const url = store.getters.url;

export default {
    props: ["userId"],
    emits: ["closeDrawer"],
    data() {
        return {
            greyTextStyle: {color: store.getters.greyColor},
            currUserId: this.userId,
            userInfo: {},
            user: JSON.parse(localStorage.getItem("userInfo")) || {},
        }
    },
    methods: {
        getUserInfo() {
            axios.get(url + "/api/users?userId=" + this.currUserId).then((res) => {
                if (res.data.code == 0) {
                    const data = res.data.data;
                    Object.keys(data).forEach(k => {
                        this.userInfo[k] = data[k];
                    })
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        getFriendsCount() {
            axios.get(url + "/api/users/friends/count?userId=" + this.currUserId).then((res) => {
                if (res.data.code == 0) {
                    const data = res.data.data;
                    Object.keys(data).forEach(k => {
                        this.userInfo[k] = data[k];
                    })
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        closeDrawer() {
            this.$emit("closeDrawer");
        },
        follow(userId) {
            follow(userId);
        },
        unfollow(userId) {
            unfollow(userId);
        },
    },
    created() {
        this.$watch("userId", (newVal) => {
            if (newVal  && newVal != null) {
                this.currUserId = newVal;
                this.getUserInfo();
                this.getFriendsCount();
            }
        })
    },
    mounted() {
        if (this.currUserId && this.currUserId != null) {
            this.getUserInfo();
            this.getFriendsCount();
        }
    }
}
</script>

<style>
.user-detail-container {
    margin-left: 20px;
    margin-right: 20px;
}
.user-desc {
    display: flex;
    margin-top: 20px;
}
.user-desc-name-and-appid {
    margin-left: 20px;
}
.user-desc-item {
    margin-top: 10px;
    white-space: pre-wrap;
}
.user-desc-following {
    display: flex;
    justify-content: space-between;
}
.user-desc-following-item {
    margin-right: 20px;
    text-align: center;
}
</style>
