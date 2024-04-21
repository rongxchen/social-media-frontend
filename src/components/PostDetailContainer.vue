<template>
    <div class="post-detail-container">
        <div v-if="post">
            <!-- top line -->
            <div class="top-line">
                <div class="top-line-left">
                    <!-- back arrow -->
                    <el-button style="border: none" @click="closeDrawer">
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
            <!-- post details -->
            <div class="post-detail">
                <!-- title -->
                <div class="post-title"> {{ post.title }} </div>
                <!-- content -->
                <div class="post-content"> {{ post.content }} </div>
                <!-- tags -->
                <div>
                    <el-link v-for="tag in post.tagList" :key="tag">
                        <span class="post-tags"> {{ "#" + tag }} </span>
                    </el-link>
                </div>
                <!-- last update -->
                <div class="post-last-modify">
                    {{ "last updated: " + post.lastModifiedTime }}
                </div>
            </div>
            <el-divider></el-divider>
            <div class="post-comment-count">
                {{ post.commentCount + " comments in total" }}
            </div>
            <!-- comments -->
            <div class="post-detail-comments">
                <div v-if="comments.list.length > 0">

                </div>
                <div v-else>
                    <el-empty description="no comments yet..."></el-empty>
                </div>
            </div>
            <!-- bottom line -->
            <div class="post-detail-bottom">
                <!-- reply -->
                <el-button class="post-detail-reply-btn" round :icon="icons.edit">
                    Say something...
                </el-button>
                <div class="post-detail-other-btns">
                    <!-- likes -->
                    <el-button class="post-detail-other-btn" @click="likePost"
                        :style="{
                            'color': this.post && this.$store.getters.likeMap.get('likes').has(this.post.postId) ? 'red': '', 
                            'border': 'none',}"
                        :icon="this.$store.getters.likeMap.get('likes').has(post.postId) ? 
                            icons.liked : icons.notLiked"
                    ><span> {{ post.likeCount }} </span>
                    </el-button>
                    <!-- favorites -->
                    <el-button class="post-detail-other-btn" @click="favoritePost"
                        :style="{
                            'color': this.post && this.$store.getters.likeMap.get('favorites').has(this.post.postId) ? '#FFD700': '', 
                            'border': 'none',}"
                        :icon="this.$store.getters.likeMap.get('favorites').has(post.postId) ? 
                            icons.favorited : icons.notFavorited"
                    ><span> {{ post.favoriteCount }} </span>
                    </el-button>
                    <!-- comments -->
                    <el-button class="post-detail-other-btn"
                        :style="{'border': 'none',}" :icon="icons.comment"
                    ><span> {{ post.commentCount }} </span>
                    </el-button>
                    </div>
                </div>
                <!-- <el-input
                    v-model="reply.content"
                    :placeholder="'reply to: ' + reply.toName"
                    style="height: 30px; background-color: #141414;"
                    clearable
                    :rows="1"
                    resize="none"
                    type="textarea"
                    maxlength="10000"
                    show-word-limit
                ></el-input>
                <el-button>Submit</el-button> -->
        </div>
        <div v-else>
            <el-empty description="post does not exist"></el-empty>
        </div>
    </div>
</template>

<script>
import store from "@/store";
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, MessageOutlined, EditOutlined } from "@ant-design/icons-vue";
import axios from "axios";

const url = store.getters.url;

export default {
    name: "HomePage",
    props: ["currPost"],
    emits: ["closeDrawer", "likePost", "favoritePost"],
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")),
            post: this.currPost,
            comments: {list: [], hasMore: true},
            reply: {
                content: "",
                toName: ""
            },
            icons: {
                liked: HeartFilled, 
                notLiked: HeartOutlined,
                favorited: StarFilled,
                notFavorited: StarOutlined,
                comment: MessageOutlined,
                edit: EditOutlined,
            },
        }
    },
    methods: {
        likePost() {
            this.$emit("likePost");
        },
        favoritePost() {
            this.$emit("favoritePost");
        },
        closeDrawer() {
            this.$emit("closeDrawer");
        },
        fetchComments() {
            axios.get(url + "/api/comments?offset=").then((res) => {
                if (res.data.code == 0) {
                    this.comments.list.push(res.data.data.list);
                    this.comments.hasMore = res.data.data.hasMore;
                }
            })
        }
    },
    mounted() {
        this.$watch("currPost", (newVal) => {
            if (newVal) {
                this.post = newVal;
            }
        })    
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
.post-detail {
    margin-top: 10px;
}
.post-title {
    font-size: 18px;
    font-weight: 500;
}
.post-content {
    font-size: 16px;
}
.post-tags {
    color: rgb(115, 200, 228);
    margin-right: 5px;
}
.post-last-modify {
    font-size: 14px;
    font-weight: 500;
    margin-top: 10px;
    color: #888888;
}
.post-detail-bottom {
    display: flex; 
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
}
.post-detail-other-btn {
    width: 50px;
}
.post-detail-other-btns {
    width: 30%;
    display: flex;
    justify-content: space-evenly;
}
.post-detail-reply-btn {
    width: 70%;
}
.post-detail-comments {
    margin-bottom: 100px;
}
.post-comment-count {
    font-size: 14px;
    margin-top: 10px;
    color: #888888;
}
</style>
