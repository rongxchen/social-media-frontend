<template>
    <div class="comment-container">
        <!-- author avatar and name -->
        <div class="comment-topline">
            <!-- avatar -->
            <el-avatar :style="avatarStyle" :src="commentInfo.authorAvatar"></el-avatar>
            <div style="width: 100%;">
                <!-- author info and like button -->
                <div class="comment-author-info">
                    <div :style="greyTextStyle" class="comment-authorname">
                        <span style="margin-right: 5px;"> {{ commentInfo.authorName }} </span>
                        <span v-if="commentInfo.authorId == userInfo.appId">
                            <el-tag class="comment-author-tag" size="small">author</el-tag>
                        </span>
                        <span v-if="commentInfo.postId != commentInfo.parentId && commentInfo.replyCommentId !== ''">
                            <el-icon><Promotion /></el-icon>
                            <span style="margin-left: 5px; margin-right: 5px;"> {{ commentInfo.replyCommentUsername }} </span>
                            <span v-if="commentInfo.replyCommentUserId == userInfo.appId">
                                <el-tag class="comment-author-tag" size="small">author</el-tag>
                            </span>
                        </span>
                    </div>
                    <div>
                        <el-button @click="likeComment(commentInfo)" 
                            :style="{
                                'color': this.commentInfo && this.$store.getters.likeMap.get('comment-likes').has(commentInfo.commentId) ? 'red': '', 
                                'border': 'none',}"
                            size="small" :icon="this.$store.getters.likeMap.get('comment-likes').has(commentInfo.commentId) ? 
                                icons.liked : icons.notLiked"
                        ><span> {{ commentInfo.likeCount }} </span>
                        </el-button>
                    </div>
                </div>
                <!-- comment content -->
                <div @click="changeReply(commentInfo)" class="comment-content">
                    {{ commentInfo.content }}
                </div>
                <!-- comment datetime -->
                <div :style="greyTextStyle" class="comment-datetime">
                    <div> {{ commentInfo.createTime }} </div>
                    <div v-if="commentInfo.authorId === userInfo.appId">
                        <el-dropdown>
                            <span>...</span>
                            <template #dropdown>
                            <el-dropdown-menu>
                                <!-- delete item -->
                                <el-dropdown-item>
                                    <el-popconfirm 
                                        width="200"
                                        title="delete the comment?"
                                        @confirm="deleteComment(commentInfo)"
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
                <!-- subcomments -->
                <div class="comment-subcomments" v-if="comment.parentId == comment.postId && commentInfo.replies">
                    <div class="comment-subcomment" v-for="subcomment in commentInfo.replies" :key="subcomment">
                        <CommentCard
                            :comment="subcomment"
                            :is-subcomment="true"
                            @change-reply="changeReply(subcomment)"
                            @delete-comment="deleteComment(subcomment)"
                        ></CommentCard>
                    </div>
                    <!-- expand more button -->
                    <a-spin :spinning="commentInfo.loading" v-if="commentInfo.replies && commentInfo.commentCount > commentInfo.replies.length">
                        <el-button @click="expandSubComments(commentInfo)" style="border: none;" size="small" class="comment-expand-btn">
                            expand more
                            <el-icon><ArrowDown /></el-icon>
                        </el-button>
                    </a-spin>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from "@/store";
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";
import axios from "axios";

const url = store.getters.url;

export default {
    props: ["comment", "isSubcomment"],
    emits: ["changeReply", "deleteComment"],
    data() {
        return {
            userInfo: {},
            commentInfo: this.comment,
            icons: {liked: HeartFilled, notLiked: HeartOutlined},
            greyTextStyle: {'color': store.getters.greyColor},
            avatarStyle: !this.isSubcomment ? 
                {width: '30px', height: '30px'} : 
                {width: '25px', height: '25px'},
        }
    },
    methods: {
        likeComment(comment) {
            let action;
            if (store.getters.likeMap.get("comment-likes").has(comment.commentId)) {
                comment.likeCount --;
                store.getters.likeMap.get("comment-likes").delete(comment.commentId);
                action = "cancel";
            } else {
                comment.likeCount ++;
                store.getters.likeMap.get("comment-likes").set(comment.commentId, 1);
                action = "collect";
            }
            axios.post(url + "/api/comments/like-comment?commentId=" + comment.commentId + "&action=" + action).then((res) => {
                if (res.data.code === 0 && !res.data.data) {
                    this.$message.error("failed");
                }
            })
        },
        changeReply(comment) {
            this.$emit("changeReply", comment);
        },
        expandSubComments(comment) {
            comment.loading = true;
            axios.get(url + "/api/comments/sub-comments?postId=" + comment.postId + "&parentId=" + comment.commentId + "&offset=" + comment.replies.length).then((res) => {
                if (res.data.code == 0) {
                    comment.replies = comment.replies.concat(res.data.data.list);
                }
                comment.loading = false;
            })
        },
        deleteComment(comment) {
            this.$emit("deleteComment", comment);
        }
    },
    mounted() {
        this.userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
        this.$watch("comment", (newVal) => {
            if (newVal && Object.keys(newVal).length > 0) {
                this.commentInfo = newVal;
            }
        })
    }
}
</script>

<style>
.comment-topline {
    display: flex;
}
.comment-author-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.comment-authorname {
    margin-left: 10px;
    font-size: 16px;
}
.comment-content {
    margin-top: -5px;
    margin-left: 10px;
    font-size: 18px;
    white-space: pre-wrap;
}
.comment-datetime {
    width: 95%;
    margin-left: 10px;
    margin-top: 2px;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
}
.comment-expand-btn {
    font-size: 10px; 
}
.comment-subcomments {
    margin-left: 10px;
    margin-top: 10px;
}
.comment-subcomment {
    margin-bottom: 10px;
}
.comment-author-tag {
    height: 16px;
    width: 40px;
    margin-right: 5px;
    font-size: 12px;
}
</style>