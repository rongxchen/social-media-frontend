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
                    <!-- top line -->
                    <div class="top-line">
                        <div class="top-line-left">
                            <!-- back arrow -->
                            <el-button style="border: none" @click="() => {this.$router.go(-1)}">
                                <el-icon><ArrowLeft /></el-icon>
                            </el-button>
                            <!-- author avatar -->
                            <el-avatar class="avatar" :src="post.authorAvatar"></el-avatar>
                            <!-- author name -->
                            <div class="author-name">
                                {{ post.authorName }}
                            </div>
                        </div>
                        <div v-if="post.authorId != user.appId">
                            <el-button v-if="true" type="danger" plain round>
                                Follow
                            </el-button>
                            <el-button v-else type="info" plain round>
                                Followed
                            </el-button>
                        </div>
                    </div>
                    <!-- images -->
                    <div class="image-container">
                        <el-carousel indicator-position="outside">
                            <el-carousel-item class="image-item" v-for="image in post.imageList" :key="image">
                                <img class="image-item" :src="image" alt="error" />
                            </el-carousel-item>
                        </el-carousel>
                    </div>
                </div>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import store from "@/store";
import SideMenu from "../components/SideMenu.vue";
import axios from "axios";

const url = store.getters.url;

export default {
    name: "HomePage",
    components: {
        SideMenu,
    },
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")),
            post: {
                postId: "", title: "", content: "", imageList: [], tagList: [], 
                authorId: "", authorName: "", authorAvatar: "", likeCount: 0, 
                favoriteCount: 0, commentCount: 0, createTime: null, updateTime: null
            },
        }
    },
    methods: {
        async getPost(postId) {
            await axios.get(url + "/api/posts/" + postId).then((res) => {
                if (res.data.code == 0) {
                    this.post = res.data.data;
                } else {
                    this.$message.error(res.data.message);
                }
            })
        }
    },
    async mounted() {
        const postId = this.$route.query.postId;
        await this.getPost(postId);
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
.top-line {
    width: 100%;
    display: flex;
    place-items: space-between;
    margin-bottom: 20px;
}
.top-line-left {
    width: 100%;
    display: flex;
}
.top-line-left .avatar {
    margin-left: 20px;
}
.top-line-left .author-name {
    font-size: 22px;
    margin-left: 15px;
}
.image-container {
    width: 100%;
}
.image-item {
    width: 100%
}
</style>
