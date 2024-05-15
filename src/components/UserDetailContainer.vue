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
                <!-- tab selection -->
                <div class="user-tab">
                    <el-tabs
                        v-model="currTab"
                        @tab-click="handleTabClick"
                    >
                        <el-tab-pane v-for="tab in tabs" :key="tab.value" 
                            :label="tab.label" :name="tab.value"
                        ></el-tab-pane>
                    </el-tabs>
                </div>
                <!-- user posts and favorites -->
                <div v-if="tabDataList[currTab].list.length > 0" class="user-posts-waterfall">
                    <div class="user-posts-container">
                        <PostCard
                            class="user-posts-container-card"
                            v-for="i in Math.ceil(tabDataList[currTab].list.length/2)" :key="i"
                            :post="tabDataList[currTab].list[(i-1)*2]"
                            @like-post="likePost(tabDataList[currTab].list[(i-1)*2])"
                            @delete-post="deletePost(tabDataList[currTab].list[(i-1)*2])"
                            @open-post-drawer="openCurrPostDetail(tabDataList[currTab].list[(i-1)*2])"
                        ></PostCard>
                    </div>
                    <div class="user-posts-container">
                        <PostCard
                            class="user-posts-container-card"
                            v-for="i in Math.floor(tabDataList[currTab].list.length/2)" :key="i"
                            :post="tabDataList[currTab].list[i*2-1]"
                            @like-post="likePost(tabDataList[currTab].list[i*2-1])"
                            @delete-post="deletePost(tabDataList[currTab].list[i*2-1])"
                            @open-post-drawer="openCurrPostDetail(tabDataList[currTab].list[i*2-1])"
                        ></PostCard>
                    </div>
                </div>
                <div v-else>
                    <el-empty description="nothing here..."></el-empty>
                </div>
                <!-- post detail drawer -->
                <div style="width: 100%;">
                    <el-drawer v-model="postDetailDrawer.visible" size="80%" :with-header="false">
                        <PostDetailContainerForUser
                            :curr-post="postDetailDrawer.currPost"
                            @like-post="likePost(postDetailDrawer.currPost)"
                            @favorite-post="favoritePost(postDetailDrawer.currPost)"
                            @close-drawer="() => {this.postDetailDrawer.visible = false;}"
                        ></PostDetailContainerForUser>
                    </el-drawer>
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
import PostCard from "./PostCard.vue";
import PostDetailContainerForUser from "./PostDetailContainerForUser.vue";
import { follow, unfollow } from "@/utils/methods/follows.js";
import { likePost, deletePost, favoritePost } from "@/utils/methods/posts.js";

const url = store.getters.url;

export default {
    props: ["userId"],
    emits: ["closeDrawer"],
    components: {
        PostCard,
        PostDetailContainerForUser,
    },
    data() {
        return {
            greyTextStyle: {color: store.getters.greyColor},
            currUserId: this.userId,
            userInfo: {},
            user: JSON.parse(localStorage.getItem("userInfo")) || {},
            currTab: "posts",
            tabs: [
                {"label": "Posts", "value": "posts"},
                {"label": "Favorites", "value": "favorites"},
            ],
            tabDataList: {
                posts: {list: [], init: false,}, 
                favorites: {list: [], init: false},
            },
            postDetailDrawer: {
                visible: false,
                currPost: {},
            },
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
            this.postDetailDrawer.visible = false;
        },
        follow(userId) {
            follow(userId);
        },
        unfollow(userId) {
            unfollow(userId);
        },
        clearTabDataList() {
            ["posts", "favorites"].forEach(k => {
                this.tabDataList[k].list = [];
                this.tabDataList[k].init = false;
            })
        },
        handleTabClick(val) {
            const tab = val.props.name;
            if (this.tabDataList[tab].init) {
                return;
            }
            this.tabDataList[tab].list = [];
            const offset = this.tabDataList[tab].list.length;
            if (tab == "posts") {
                this.getUserPosts(this.userId, offset);
            } else {
                this.getUserFavorites(this.userId, offset);
            }
            this.tabDataList[tab].init = true;
        },
        likePost(post) {
            likePost(post).then((res) => {
                if (res.data.code === 0 && !res.data.data) {
                    this.$message.error("failed");
                }
            });
        },
        deletePost(postId) {
            deletePost(postId);
        },
        favoritePost(post) {
            favoritePost(post).then((res) => {
                if (res.data.code === 0 && !res.data.data) {
                    this.$message.error("failed");
                }
            })
        },
        openCurrPostDetail(post) {
            this.postDetailDrawer.currPost = post;
            this.postDetailDrawer.visible = true;
        },
        getUserPosts(userId, offset) {
            axios.get(url + "/api/posts?offset=" + offset + "&userId=" + userId)
                .then((res) => {
                    if (res.data.code == 0) {
                        const data = res.data.data;
                        this.tabDataList["posts"].list = data.concat(this.tabDataList["posts"].list);
                        this.tabDataList["posts"].init = true;
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
        },
        getUserFavorites(userId, offset) {
            axios.get(url + "/api/posts/collected?offset=" + offset + "&itemType=favorites&userId=" + userId)
                .then((res) => {
                    if (res.data.code == 0) {
                        const data = res.data.data;
                        this.tabDataList["favorites"].list = data.concat(this.tabDataList["favorites"].list);
                        this.tabDataList["favorites"].init = true;
                    } else {
                        this.$message.error(res.data.message);
                    }
                })
        }
    },
    created() {
        this.$watch("userId", (newVal) => {
            if (newVal) {
                this.currUserId = newVal;
                this.getUserInfo();
                this.getFriendsCount();
                this.clearTabDataList();
                this.postDetailDrawer.visible = false;
                this.getUserPosts(this.currUserId, 0);
            }
        })
    },
    mounted() {
        if (this.currUserId) {
            this.getUserInfo();
            this.getFriendsCount();
            this.getUserPosts(this.currUserId, 0);
        }
    }
}
</script>

<style scoped>
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
.user-posts-waterfall {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.user-post-container {
    width: 40%;
}
.user-posts-container-card {
    margin-bottom: 20px;
    width: 300px;
}
.user-tab {
    display: flex; 
    justify-content: center;
}
</style>
