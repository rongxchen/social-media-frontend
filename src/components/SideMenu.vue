<template>
    <div class="side-menu">
        <!-- avatar -->
        <div class="avatar">
            <el-avatar size="large" :src="user.avatar"></el-avatar>
            <p :style="{'color': greyColor, 'font-weight': '700', 'margin-top': '15px'}"
                v-text="'Hello ' + (user.username.length >= 10?
                    user.username.substring(0, 10)+'...': user.username)">
            </p>
        </div>
        <!-- side menu -->
        <el-menu
            :default-active="currentRoute"
            mode="vertical"
            style="border: none;"
            @select="handleSelect"
        >
        <div v-for="route in routes" :key="route">
                <!-- if has submenu -->
                <el-sub-menu v-if="route.children && route.children.length > 0" :index="route.path">
                    <template #title>
                        <el-icon>
                            <component :is="route.icon"></component>
                        </el-icon>
                        {{ route.label }}
                        <el-tag v-if="route.badgeCount" style="margin-left: 10px;" round effect="light" type="danger" size="small">
                            {{ route.badgeCount }}
                        </el-tag>
                    </template>
                    <!-- sub menus -->
                    <el-menu-item v-for="sub in route.children" :index="sub.path" :key="sub">
                        <template #title>
                            <el-icon>
                                <component :is="sub.icon"></component>
                            </el-icon>
                            {{ sub.label }}
                            <el-tag v-if="route.badgeCount" style="margin-left: 10px;" round effect="light" type="danger" size="small">
                                {{ route.badgeCount }}
                            </el-tag>
                        </template>
                    </el-menu-item>
                </el-sub-menu>
                <!-- if not -->
                <el-menu-item v-else :index="route.path">
                    <template #title>
                        <el-icon>
                            <component :is="route.icon"></component>
                        </el-icon>
                        {{ route.label }}
                        <el-tag v-if="route.badgeCount && route.badgeCount > 0" style="margin-left: 10px;" round effect="light" type="danger" size="small">
                            {{ route.badgeCount <= 99 ? route.badgeCount : '99+' }}
                        </el-tag>
                    </template>
                </el-menu-item>
            </div>
        </el-menu>
        <!-- logout -->
        <div class="logout-button">
            <el-switch
                v-model="isDark"
                size="large"
                :active-action-icon="icons.moonIcon"
                :inactive-action-icon="icons.sunIcon"
                inline-prompt
                @change="switchThemes()"
                style="margin-bottom: 10px;"
            />
            <el-button @click="logout" type="danger">Log out</el-button>
        </div>
    </div>
</template>

<script>
import store from "@/store";
import { markRaw } from "vue";
import { useToggle } from '@vueuse/core';
import { Sunny, Moon } from '@element-plus/icons-vue'

export default {
    name: "SideMenu",
    setup() {
        return {
        }
    },
    data() {
        return {
            user: {username: ""},
            currentRoute: "/profile",
            routes: [
                {
                    path: "/home",
                    label: "Home",
                    icon: "House"
                },
                {
                    path: "/add-post",
                    label: "Add Post",
                    icon: "Plus"
                },
                {
                    path: "/chat",
                    label: "Chat",
                    icon: "ChatDotSquare",
                    badgeCount: this.$store.getters.totalUnread,
                },
                {
                    path: "/profile",
                    label: "Profile",
                    icon: "User"
                }
            ],
            isDark: store.getters.theme,
            greyColor: store.getters.greyColor,
            icons: {moonIcon: markRaw(Moon), sunIcon: markRaw(Sunny)},
        }
    },
    methods: {
        getUserInfo() {
            this.user = JSON.parse(localStorage.getItem("userInfo")) || {};
        },
        switchThemes() {
            useToggle(this.isDark);
            this.$store.commit("changeTheme");
        },
        handleSelect(key) {
            this.$router.push(key);
        },
        logout() {
            if (store.getters.socket) {
                store.getters.socket.disconnect();
            }
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userInfo");
            this.$router.push("/login");
        },
        updateChatBadgeCount(newMsgCount) {
            for (const route of this.routes) {
                if (route.path == "/chat") {
                    route.badgeCount = newMsgCount;
                    break;
                }
            }
        }
    },
    mounted() {
        this.getUserInfo();
        this.currentRoute = (this.$route.path == "/" || this.$route.path == "/login")? "/login": this.$route.path;
    }
}
</script>

<style>
.side-menu {
    margin-top: 30px;
}
.avatar {
    display: grid;
    place-items: center;
    margin-bottom: 10px;
}
.logout-button {
    display: grid;
    place-items: center;
}
</style>
