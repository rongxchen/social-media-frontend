<template>
    <el-card class="post-card">
        <!-- post image -->
        <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="imageUrl in postInfo.imageList" :key="imageUrl">
                <img class="post-img" :src="imageUrl"/>
            </el-carousel-item>
        </el-carousel>
        <!-- post title -->
        <div class="card-title"> {{ postInfo.title }} </div>
        <div class="card-bottom">
            <!-- post author -->
            <div class="card-author"> 
                <!-- avatar -->
                <el-avatar :size="24" :src="postInfo.authorAvatar"></el-avatar>
                <!-- author name -->
                <div class="card-author-name"> 
                    {{ postInfo.authorName }} 
                </div>
            </div>
            <!-- like button -->
            <div class="card-like-icon">
                <div>
                    <el-button @click="likePost" :style="{'color': this.$store.getters.likeMap.has(postInfo.postId) ? 
                        'red': '', 'border': 'none'}" 
                        size="small" :icon="this.$store.getters.likeMap.has(postInfo.postId) ? 
                            icons.liked : icons.notLiked"
                    ></el-button>
                    <span class="card-like-likes"> {{ post.likeCount }} </span>
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import store from "@/store";
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";

export default {
    props: ["post"],
    data() {
        return {
            postInfo: this.post,
            icons: {liked: HeartFilled, notLiked: HeartOutlined}
        }
    },
    methods: {
        likePost() {
            if (store.getters.likeMap.has(this.postInfo.postId)) {
                store.getters.likeMap.delete(this.postInfo.postId);
            } else {
                store.getters.likeMap.set(this.postInfo.postId, 1);
            }
        }
    },
    mounted() {
    }
}
</script>

<style>
.post-card {
    margin-bottom: 20px
}
.post-img {
    width: 220px;
}
.card-title {
    margin-top: 5px;
    width: 220px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* max lines */
    overflow: hidden;
    text-overflow: ellipsis;
}
.card-author {
    font-size: 14px;
    display: flex;
    margin-top: 10px;
}
.card-author-name {
    margin-left: 10px;
    display: grid;
    align-items: center;
}
.card-bottom {
    display: flex;
    justify-content: space-between;
}
.card-like-icon {
    display: grid;
    align-items: end;
}
.card-like-likes {
    font-size: 12px;
}
</style>