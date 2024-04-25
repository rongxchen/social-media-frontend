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
                    <el-button @click="follow(post.authorId)" v-if="!this.$store.getters.friendMap.get('follows').has(post.authorId)" type="danger" plain round size=small>
                        Follow
                        <el-icon><Plus /></el-icon>
                    </el-button>
                    <el-button @click="unfollow(post.authorId)" v-else type="info" plain round size="small">
                        Followed
                        <el-icon><Check /></el-icon>
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
                    <div class="comment-item" v-for="comment in comments.list" :key="comment">
                        <CommentCard
                            :comment="comment"
                            :is-subcomment="false"
                            @change-reply="changeReply"
                            @delete-comment="deleteComment"
                        ></CommentCard>
                        <el-divider></el-divider>
                    </div>
                </div>
                <div v-else>
                    <el-empty description="no comments yet..."></el-empty>
                </div>
            </div>
            <!-- bottom line -->
            <div class="post-detail-bottom">
                <!-- reply -->
                <el-button @click="{this.changeReply();}" class="post-detail-reply-btn" round :icon="icons.edit">
                    Say something...
                </el-button>
                <!-- reply dialog -->
                <el-dialog v-model="reply.dialogVisible">
                    <a-spin :spinning="reply.loading">
                        <el-input
                            id="postReplyInput"
                            v-model="reply.content"
                            :placeholder="'Reply to: ' + reply.toName"
                            clearable
                            :rows="10"
                            resize="none"
                            type="textarea"
                            maxlength="10000"
                            show-word-limit
                        ></el-input>
                        <div style="display: flex; justify-content: end; margin-top: 10px;">
                            <el-button @click="addComment" type="primary" plain>Submit</el-button>
                        </div>
                    </a-spin>
                </el-dialog>
                <div class="post-detail-other-btns">
                    <!-- likes -->
                    <el-button class="post-detail-other-btn" @click="likePost"
                        :style="{
                            'color': this.post && this.$store.getters.likeMap.get('likes').has(this.post.postId) ? 'red': '', 
                            'border': 'none',}"
                        :icon="this.$store.getters.likeMap.get('likes').has(post.postId) ? 
                            icons.liked : icons.notLiked"
                    ><span class="btn-text"> {{ post.likeCount }} </span>
                    </el-button>
                    <!-- favorites -->
                    <el-button class="post-detail-other-btn" @click="favoritePost"
                        :style="{
                            'color': this.post && this.$store.getters.likeMap.get('favorites').has(this.post.postId) ? '#FFD700': '', 
                            'border': 'none',}"
                        :icon="this.$store.getters.likeMap.get('favorites').has(post.postId) ? 
                            icons.favorited : icons.notFavorited"
                    ><span class="btn-text"> {{ post.favoriteCount }} </span>
                    </el-button>
                    <!-- comments -->
                    <el-button class="post-detail-other-btn"
                        :style="{'border': 'none',}" :icon="icons.comment"
                    ><span class="btn-text"> {{ post.commentCount }} </span>
                    </el-button>
                </div>
            </div>
        </div>
        <div v-else>
            <el-empty description="post does not exist"></el-empty>
        </div>
    </div>
</template>

<script>
import store from "@/store";
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, MessageOutlined, EditOutlined } from "@ant-design/icons-vue";
import { ElNotification } from 'element-plus'
import CommentCard from "./CommentCard.vue";
import axios from "axios";
import { follow, unfollow } from "@/utils/methods/follows.js";

const url = store.getters.url;

export default {
    name: "HomePage",
    props: ["currPost", "open"],
    emits: ["closeDrawer", "likePost", "favoritePost"],
    components: {
        CommentCard,
    },
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")),
            post: this.currPost,
            comments: {list: [], size: 20},
            reply: {
                content: "",
                parentId: "",
                replyCommentId: "",
                replyCommentUserId: "",
                toName: "",
                dialogVisible: false,
                loading: false,
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
        changeReply(item=this.post) {
            this.reply.toName = item.authorName;
            this.reply.replyCommentUserId = item.authorId;
            if (item.postId && !item.commentId) {
                this.reply.parentId = item.postId;
            } else if (item.commentId && item.postId == item.parentId) {
                this.reply.parentId = item.commentId;
            } else {
                this.reply.parentId = item.parentId;
                this.reply.replyCommentId = item.commentId;
            }
            this.reply.dialogVisible = true;
        },
        updateCommentCount(comment) {
            this.post.commentCount++;
            if (comment.parentId != comment.postId) {
                for (const parentComment of this.comments.list) {
                    if (parentComment.commentId == comment.parentId) {
                        parentComment.commentCount++;
                        break;
                    }
                }
            }
        },
        addComment() {
            if (this.reply.content.trim() == "") {
                this.$message.warning("comment content must not be empty");
                return;
            }
            this.reply.loading = true;
            axios.post(url + "/api/comments", {
                content: this.reply.content, postId: this.post.postId,
                parentId: this.reply.parentId, replyCommentId: this.reply.replyCommentId,
                replyCommentUserId: this.reply.replyCommentUserId,
            }).then((res) => {
                if (res.data.code == 0) {
                    ElNotification({
                        message: "commented successfully",
                        type: "success",
                        duration: 1000,
                    })
                    this.reply.content = "";
                    this.reply.dialogVisible = false;
                    const comment = res.data.data;
                    this.updateCommentCount(comment);
                    if (comment.postId == comment.parentId) {
                        comment.replies = [];
                        comment.loading = false;
                        this.comments.list.push(comment);
                    } else {
                        for (const c of this.comments.list) {
                            if (c.commentId == comment.parentId) {
                                c.replies.push(comment);
                                break;
                            }
                        }
                    }
                } else {
                    ElNotification({
                        message: res.data.message,
                        type: "warning",
                        duration: 1000,
                    })
                }
                this.reply.loading = false;
            })
        },
        fetchComments() {
            axios.get(url + "/api/comments?postId=" + this.post.postId + "&offset=" + this.comments.list.length).then((res) => {
                if (res.data.code == 0) {
                    this.comments.list = this.comments.list.concat(res.data.data.list);
                    for (const comment of this.comments.list) {
                        comment.replies = [];
                        comment.loading = false;
                    }
                }
            })
        },
        deleteComment(comment) {
            const deleteFromComments = (commentId) => {
                this.comments.list = this.comments.list.filter(x => x.commentId != commentId);
                this.post.commentCount--;
            }
            const deleteFromSubcomments = (parentCommentId, commentId) => {
                const deleteFromReplies = (parentCommentId, commentId) => {
                    for (const parentComment of this.comments.list) {
                        if (parentComment.commentId == parentCommentId) {
                            parentComment.replies = parentComment.replies.filter(x => x.commentId != commentId);
                            parentComment.commentCount--;
                            this.post.commentCount--;
                            break;
                        }
                    }
                }
                for (const parentComment of this.comments.list) {
                    if (parentComment.commentId == parentCommentId) {
                        deleteFromReplies(parentCommentId, commentId);
                        break;
                    }
                }
            }
            axios.delete(url + "/api/comments?commentId=" + comment.commentId).then((res) => {
                if (res.data.code == 0 && res.data.data) {
                    if (comment.parentId == comment.postId) {
                        deleteFromComments(comment.commentId);
                    } else {
                        deleteFromSubcomments(comment.parentId, comment.commentId);
                    }
                } else {
                    this.$message.error(res.data.message);
                }
            })
        },
        follow(userId) {
            follow(userId);
        },
        unfollow(userId) {
            unfollow(userId);
        }
    },
    created() {
        this.$watch("currPost", (val) => {
            if (val) {
                this.post = val;
                this.comments.list = [];
                Object.keys(this.reply).forEach(k => {
                    this.reply[k] = "";
                });
                this.reply.dialogVisible = false,
                this.reply.loading= false,
                this.fetchComments();   
            }
        })
    },
    mounted() {
        this.fetchComments();
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
    white-space: pre-wrap;
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
    margin-top: 20px;
}
.post-comment-count {
    font-size: 14px;
    margin-top: 10px;
    color: #888888;
}
.comment-item {
    margin-bottom: 10px;
    margin-top: 10px;
}
.btn-text {
    color: #888888;
}
</style>
