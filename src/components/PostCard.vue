<template>
    <el-card class="post-card">
        <!-- post image -->
        <img @click="openPostDetail" class="post-img" :src="postInfo.imageList[0]"/>
        <div class="post-container">
            <!-- post title -->
            <div @click="openPostDetail" class="card-title"> {{ postInfo.title }} </div>
            <div class="card-bottom">
                <!-- post author -->
                <div @click="openPostDetail" class="card-author"> 
                    <!-- avatar -->
                    <el-avatar :size="24" :src="postInfo.authorAvatar"></el-avatar>
                    <!-- author name -->
                    <div class="card-author-name"> 
                        {{ postInfo.authorName }} 
                    </div>
                </div>
                <!-- bottom right hand side -->
                <div class="card-bottom-right">
                    <!-- like button and like count -->
                    <div class="card-like-icon">
                        <el-button @click="likePost" 
                            :style="{
                                'color': this.postInfo && this.$store.getters.likeMap.get('likes').has(this.postInfo.postId) ? 'red': '', 
                                'border': 'none',}"
                            size="small" :icon="this.$store.getters.likeMap.get('likes').has(postInfo.postId) ? 
                                icons.liked : icons.notLiked"
                        ><span class="card-like-likes"> {{ postInfo.likeCount }} </span>
                        </el-button>
                    </div>
                    <!-- operations like delete -->
                    <div class="post-operations">
                        <el-dropdown>
                            <span>...</span>
                            <template #dropdown>
                            <el-dropdown-menu>
                                <!-- delete item -->
                                <el-dropdown-item
                                    v-if="postInfo.authorId === userInfo.appId"
                                ><el-popconfirm 
                                        width="200"
                                        title="delete the post?"
                                        @confirm="deletePost"
                                    ><template #reference>
                                        <el-link type="danger" size="small" plain>
                                            delete
                                        </el-link>
                                    </template>
                                </el-popconfirm>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                            </template>
                        </el-dropdown>               
                    </div>
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
    emits: ["likePost", "deletePost", "openPostDrawer"],
    data() {
        return {
            userInfo: {},
            postInfo: this.post,
            icons: {liked: HeartFilled, notLiked: HeartOutlined},
            checkLikedStyle: {
                'color': this.postInfo && store.getters.likeMap.has(this.postInfo.postId) ? 'red': '', 
                'border': 'none',
            }
        }
    },
    methods: {
        likePost() {
            this.$emit("likePost");
        },
        deletePost() {
            this.$emit("deletePost", this.postInfo.postId);
        },
        openPostDetail() {
            this.$emit("openPostDrawer", this.postInfo);
        },
    },
    mounted() {
        this.userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        this.$watch("post", (newVal) => {
            if (newVal && Object.keys(newVal).length > 0) {
                this.postInfo = newVal;
            }
        })
    }
}
</script>

<style>
.post-card {
    /* margin-bottom: 20px; */
    width: 300px;
    height: auto;
    & .el-card__body {
        padding: 0;
    }
}
.post-container {
    padding: 0px;
    object-fit: contain;
}
.post-img {
    /* width: 220px; */
    height: 100%;
    width: 100%;
}
.card-title {
    margin-top: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* max lines */
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
    margin-right: 10px;
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
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* max lines */
    overflow: hidden;
    text-overflow: ellipsis;
}
.card-bottom {
    display: flex;
    justify-content: space-between;
    margin-left: 10px;
    margin-right: 10px;
}
.card-bottom-right {
    display: flex;
    align-items: center;
}
.card-like-likes {
    font-size: 12px;
}
</style>