<template>
    <div class="tab-container">
        <!-- tab selection -->
        <div>
            <el-tabs
                v-model="currTab"
                @tab-click="handleTabClick"
            >
                <el-tab-pane v-for="tab in tabs" :key="tab.value" 
                    :label="tab.label" :name="tab.value"
                ></el-tab-pane>
            </el-tabs>
        </div>
        <!-- item list -->
        <div class="profile-posts-waterfall">
            <div class="profile-posts-container">
                <PostCard
                    class="profile-posts-container-card"
                    v-for="i in Math.ceil(tabDataList[currTab].list.length/2)" :key="i"
                    :post="tabDataList[currTab].list[(i-1)*2]"
                    @like-post="likePost(tabDataList[currTab].list[(i-1)*2])"
                    @delete-post="deletePost(tabDataList[currTab].list[(i-1)*2])"
                    @open-post-drawer="openCurrPostDetail(tabDataList[currTab].list[(i-1)*2])"
                ></PostCard>
            </div>
            <div class="profile-posts-container">
                <PostCard
                    class="profile-posts-container-card"
                    v-for="i in Math.floor(tabDataList[currTab].list.length/2)" :key="i"
                    :post="tabDataList[currTab].list[i*2-1]"
                    @like-post="likePost(tabDataList[currTab].list[i*2-1])"
                    @delete-post="deletePost(tabDataList[currTab].list[i*2-1])"
                    @open-post-drawer="openCurrPostDetail(tabDataList[currTab].list[i*2-1])"
                ></PostCard>
            </div>
        </div>
        <!-- post detail drawer -->
        <div style="width: 100%;">
            <el-drawer v-model="postDetailDrawer.visible" size="60%" :with-header="false">
                <PostDetailContainer
                    :curr-post="postDetailDrawer.currPost"
                    @like-post="likePost(postDetailDrawer.currPost)"
                    @favorite-post="favoritePost(postDetailDrawer.currPost)"
                    @close-drawer="() => {this.postDetailDrawer.visible = false;}"
                ></PostDetailContainer>
            </el-drawer>
        </div>
    </div>
</template>

<script>
import store from "@/store";
import PostCard from "./PostCard.vue"; 
import PostDetailContainer from "./PostDetailContainer.vue";
import axios from "axios";
import { likePost, deletePost, favoritePost } from "@/utils/methods/posts.js";

const url = store.getters.url;

export default {
    components: {
        PostCard,
        PostDetailContainer
    },
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")) || {},
            currTab: "posts",
            tabs: [
                {"label": "Posts", "value": "posts"},
                {"label": "Favorites", "value": "favorites"},
                {"label": "Likes", "value": "likes"}
            ],
            tabDataList: {
                posts: {list: [], init: false,}, 
                favorites: {list: [], init: false}, 
                likes: {list: [], init: false}
            },
            postDetailDrawer: {
                visible: false,
                currPost: {},
            }
        }
    },
    methods: {
        handleTabClick(val) {
            const tab = val.props.name;
            if (this.tabDataList[tab].init) {
                return;
            }
            const offset = this.tabDataList[tab].list.length;
            if (tab == "posts") {
                this.getMyPosts(this.user.appId, offset);
            } else {
                this.getCollectedPosts(this.user.appId, tab, offset);
            }
            this.tabDataList[tab].init = true;
        },
        getCollectedPosts(userId, itemType, offset) {
            axios.get(url + "/api/posts/collected?userId=" + userId + "&itemType=" + itemType + "&offset=" + offset).then((res) =>{
                if (res.data.code == 0) {
                    const data = res.data.data;
                    this.tabDataList[itemType].list = this.tabDataList[itemType].list.concat(data);
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        getMyPosts(userId, offset) {
            axios.get(url + "/api/posts?userId=" + userId + "&offset=" + offset).then((res) =>{
                if (res.data.code == 0) {
                    const data = res.data.data;
                    this.tabDataList["posts"].list = this.tabDataList["posts"].list.concat(data);
                } else {
                    this.$message.error(res.data.message);
                }
            })
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
        }
    },
    mounted() {
        this.handleTabClick({props: {name: this.currTab}});
    }
}
</script>

<style>
.tab-container {
    width: 100%;
    display: grid;
    place-items: center;
}
.card-area {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}
.profile-posts-waterfall {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.profile-post-container {
    width: 40%;
}
.profile-posts-container-card {
    margin-bottom: 20px;
}
</style>