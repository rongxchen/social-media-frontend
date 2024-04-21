<template>
    
</template>

<script>
import store from "@/store";
import { HeartOutlined, HeartFilled } from "@ant-design/icons-vue";

export default {
    props: ["comment"],
    data() {
        return {
            userInfo: {},
            commentInfo: this.comment,
            icons: {liked: HeartFilled, notLiked: HeartOutlined},
            checkLikedStyle: {
                'color': this.postInfo && store.getters.likeMap.has(this.postInfo.postId) ? 'red': '', 
                'border': 'none',
            }
        }
    },
    methods: {
        
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

</style>