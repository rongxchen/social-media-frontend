<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="15%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="85%">
            <div class="right-side-page">
                <!-- search box -->
                <el-input></el-input>
                <!-- contents -->
                <div v-for="post in posts" :key="post.postId">
                    <PostCard
                        :post="post"
                    ></PostCard>
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
            axios.get(url + "/api/posts/" + this.pagination.currPage).then((res) => {
                this.posts = this.posts.concat(res.data.data);
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
</style>
