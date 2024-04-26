<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="15%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="85%">
            <div class="right-side-page">
                <div class="right-side-content">
                    <!-- search box -->
                    <el-input></el-input>
                    <!-- contents -->
                    <div class="posts-waterfall">
                        <div class="posts-container">
                            <PostCard
                                class="posts-container-card"
                                v-for="i in Math.ceil(posts.length/2)" :key="i"
                                :post="posts[(i-1)*2]"
                                @like-post="likePost(posts[(i-1)*2])"
                                @delete-post="deletePost"
                                @open-post-drawer="openCurrPostDetail"
                            ></PostCard>
                        </div>
                        <div class="posts-container">
                            <PostCard
                                class="posts-container-card"
                                v-for="i in Math.floor(posts.length/2)" :key="i"
                                :post="posts[i*2-1]"
                                @like-post="likePost(posts[i*2-1])"
                                @delete-post="deletePost"
                                @open-post-drawer="openCurrPostDetail"
                            ></PostCard>
                        </div>
                    </div>
                    <!-- post detail container -->
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
            pagination: {
                currPage: 1,
            },
            postDetailDrawer: {
                visible: false,
                currPost: {},
            }
        }
    },
    methods: {
        getPosts() {
            axios.get(url + "/api/posts?offset=" + this.posts.length).then((res) => {
                this.posts = this.posts.concat(res.data.data);
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
        async getLikesRecord() {
            await axios.get(url + "/api/posts/record").then((res) => {
                if (res.data.code === 0) {
                    const data = res.data.data;
                    store.commit("resetLikeMap", data);
                }
            })
        },
        async getFriendMap() {
            await axios.get(url + "/api/users/friends").then((res) => {
                if (res.data.code === 0) {
                    const data = res.data.data;
                    store.commit("resetFriendMap", data);
                }
            })
        },
    },
    async created() {
        if (store.getters.friendMap == null) {
            await this.getFriendMap();
        }
    },
    async mounted() {
        if (store.getters.likeMap == null) {
            await this.getLikesRecord();
        }
        this.getPosts();
    }
}
</script>

<style>
.container {
    height: 100vh;
}
.right-side-page {
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 100px;
    margin-right: 100px;
}
.right-side-content {
    width: 80%;
}
.posts-waterfall {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.post-container {
    width: 40%;
}
.posts-container-card {
    margin-bottom: 20px;
}
</style>
