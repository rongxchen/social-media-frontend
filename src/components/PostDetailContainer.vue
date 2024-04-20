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
        </div>
        <div v-else>
            <el-empty description="post does not exist"></el-empty>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomePage",
    props: ["currPost"],
    emits: ["closeDrawer"],
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")),
            post: this.currPost,
        }
    },
    methods: {
        closeDrawer() {
            this.$emit("closeDrawer");
        }
    },
    mounted() {
        this.$watch("currPost", (newVal) => {
            if (newVal) {
                console.log(newVal);
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
</style>
