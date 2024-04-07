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
                                class="post-container"
                                v-for="i in Math.ceil(posts.length/2)" :key="i"
                                :post="posts[(i-1)*2]"
                                @delete-post="deletePost"
                            ></PostCard>
                        </div>
                        <div class="posts-container">
                            <PostCard
                                class="post-container"
                                v-for="i in Math.floor(posts.length/2)" :key="i"
                                :post="posts[i*2-1]"
                                @delete-post="deletePost"
                            ></PostCard>
                        </div>
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
import axios from "axios";

const url = store.getters.url;

export default {
    name: "HomePage",
    components: {
        SideMenu,
        PostCard,
    },
    data() {
        return {
            posts: [],
            pagination: {
                currPage: 1,
            }
        }
    },
    methods: {
        getPosts() {
            axios.get(url + "/api/posts?page=" + this.pagination.currPage).then((res) => {
                this.posts = this.posts.concat(res.data.data);
            })
        },
        deletePost(postId) {
            const deleteFromPosts = (postId) => {
                this.posts = this.posts.filter(x => x.postId != postId);
            }
            axios.delete(url + "/api/posts?postId=" + postId).then((res) => {
                if (res.data.code == 0) {
                    deleteFromPosts(postId);
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
            })
        }
    },
    mounted() {
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
    width: 75%;
}
.posts-waterfall {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
}
.post-container {
    margin-bottom: 20px;
}
</style>
