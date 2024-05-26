<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="12%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="88%">
            <div class="home-page">
                <!-- search box -->
                <div class="search-box">
                    <el-input
                        v-model="search.keyword"
                        clearable
                    ></el-input>
                    <el-button type="info" plain style="margin-left: 5px;">
                        <el-icon><Search /></el-icon>
                    </el-button>
                </div>
                <!-- contents -->
                <div class="posts-waterfall">
                    <div class="posts-container">
                        <PostCard
                            class="posts-container-card"
                            v-for="i of postIndexArray.filter(x => x%3 == 0)" :key="i"
                            :post="posts[i]"
                            @like-post="likePost(posts[i])"
                            @delete-post="deletePost"
                            @open-post-drawer="openCurrPostDetail"
                        ></PostCard>
                    </div>
                    <div class="posts-container">
                        <PostCard
                            class="posts-container-card"
                            v-for="i of postIndexArray.filter(x => x%3 == 1)" :key="i"
                            :post="posts[i]"
                            @like-post="likePost(posts[i])"
                            @delete-post="deletePost"
                            @open-post-drawer="openCurrPostDetail"
                        ></PostCard>
                    </div>
                    <div class="posts-container">
                        <PostCard
                            class="posts-container-card"
                            v-for="i of postIndexArray.filter(x => x%3 == 2)" :key="i"
                            :post="posts[i]"
                            @like-post="likePost(posts[i])"
                            @delete-post="deletePost"
                            @open-post-drawer="openCurrPostDetail"
                        ></PostCard>
                    </div>
                </div>
                <!-- expand more button -->
                <div class="expand-more">
                    <a-spin :spinning="pagination.loading">
                        <el-button style="border: none;" :disabled="!pagination.hasMore" v-text="pagination.placeholder" @click="getPosts()" class="expand-more"></el-button>
                    </a-spin>
                </div>
                <!-- post detail container -->
                <div style="width: 100%;">
                    <el-drawer v-model="postDetailDrawer.visible" size="60%" :with-header="false">
                        <PostDetailContainer
                            :curr-post="postDetailDrawer.currPost"
                            @like-post="likePost(postDetailDrawer.currPost)"
                            @favorite-post="favoritePost(postDetailDrawer.currPost)"
                            @close-drawer="closePostDetailContainer()"
                        ></PostDetailContainer>
                    </el-drawer>
                </div>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import store from "@/store";
import SideMenu from "../components/SideMenu.vue";
import PostCard from "../components/PostCard.vue";
import PostDetailContainer from "../components/PostDetailContainer.vue";
import axios from "axios";
import { likePost, deletePost, favoritePost } from "@/utils/methods/posts.js";

const url = store.getters.url;

export default {
    name: "HomePage",
    components: {
        SideMenu,
        PostCard,
        PostDetailContainer,
    },
    data() {
        return {
            posts: [],
            postIndexArray: [],
            pagination: {
                loading: false,
                hasMore: true,
                placeholder: "expand more...",
            },
            postDetailDrawer: {
                visible: false,
                currPost: {},
            },
            search: {
                keyword: "",
            }
        }
    },
    methods: {
        getPosts() {
            this.pagination.loading = true;
            axios.get(url + "/api/posts?offset=" + this.posts.length).then((res) => {
                const data = res.data.data;
                if (data.length == 0) {
                    this.pagination.hasMore = false;
                    this.pagination.placeholder = "no more posts...";
                    this.pagination.loading = false;
                    return;
                }
                const arr = [];
                for (let i = this.posts.length; i < this.posts.length + data.length; i++) {
                    arr.push(i);
                }
                this.postIndexArray = this.postIndexArray.concat(arr);
                this.posts = this.posts.concat(data);
                this.pagination.loading = false;
            })
        },
        openCurrPostDetail(post) {
            this.postDetailDrawer.currPost = post;
            this.postDetailDrawer.visible = true;
        },
        likePost(post) {
            likePost(post).then((res) => {
                if (res.data.code === 0 && !res.data.data) {
                    this.$message.error("failed");
                }
            });
        },
        favoritePost(post) {
            favoritePost(post).then((res) => {
                if (res.data.code === 0 && !res.data.data) {
                    this.$message.error("failed");
                }
            })
        },
        deletePost(postId) {
            const deleteFromPosts = (postId) => {
                this.posts = this.posts.filter(x => x.postId != postId);
            }
            deletePost(postId).then((res) => {
                if (res.data.code == 0) {
                    deleteFromPosts(postId);
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        closePostDetailContainer() {
            this.postDetailDrawer.visible = false; 
            this.postDetailDrawer.currPost = null;
        },
    },
    async mounted() {
        this.getPosts();
    }
}
</script>

<style scoped>
.container {
    height: 100vh;
}
.home-page {
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 50px;
    margin-right: 50px;
}
.search-box {
    width: 40%;
    display: flex;
}
.posts-waterfall {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.posts-container {
    width: 280px;
}
.posts-container-card {
    width: 100%;
    margin-bottom: 20px;
}
.expand-more {
    width: 100%;
}
</style>
