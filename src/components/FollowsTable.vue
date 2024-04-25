<template>
    <el-table :data="currList" style="width: 100%">
        <!-- avatar -->
        <el-table-column prop="avatar">
            <template v-slot="scope">
                <el-avatar size=small :src="scope.row.avatar"></el-avatar>
            </template>
        </el-table-column>
        <!-- username -->
        <el-table-column prop="username" />
        <!-- follow button -->
        <el-table-column>
            <template v-slot="scope">
                <div v-if="scope.row.appId != user.appId">
                    <el-button @click="follow(scope.row.appId)" v-if="!this.$store.getters.friendMap.get('follows').has(scope.row.appId)" type="danger" plain round size="small">
                        Follow
                        <el-icon><Plus /></el-icon>
                    </el-button>
                    <el-button @click="unfollow(scope.row.appId)" v-else type="info" plain round size="small">
                        Followed
                        <el-icon><Check /></el-icon>
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import { follow, unfollow } from "@/utils/methods/follows.js";

export default {
    props: ["currList"],
    emits: ["updateFollowCounts"],
    data() {
        return {
            user: JSON.parse(localStorage.getItem("userInfo")) || {},
        }
    },
    methods: {
        async follow(userId) {
            await follow(userId);
            this.$emit("updateFollowCounts");
        },
        async unfollow(userId) {
            await unfollow(userId);
            this.$emit("updateFollowCounts");
        }
    },
    mounted() {
    }
}
</script>