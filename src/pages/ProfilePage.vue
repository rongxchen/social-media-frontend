<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="12%">
            <SideMenu ref="sideMenuRef"></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="88%">
            <div class="right-side-page">
                <!-- user profile description -->
                <div class="profile-description-container">
                    <el-descriptions
                        direction="horizontal"
                        :column="1"
                        size="large"
                        border
                    >
                        <!-- icon, username, appid -->
                        <el-descriptions-item label="">
                            <div class="profile-desc-intro">
                                <!-- avatar -->
                                <el-upload
                                    action="#"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    :on-change="uploadAvatar"
                                ><el-avatar size="large" :src="user.avatar"></el-avatar>
                                </el-upload>
                                <div class="profile-desc-personal">
                                    <!-- username -->
                                    <div class="profile-desc-name"> 
                                        {{ user.username }} 
                                        <!-- <el-tag size="small" round :type="user.sex == 'M' ? 'primary' : 'danger'" style="border: none;" v-if="user.sex != null && user.sex != '' && user.sex != 'N/A'">
                                            <div v-if="user.sex == 'M'">
                                                <el-icon style="background-color: lightblue;"><Male /></el-icon>
                                            </div>
                                            <div v-else-if="user.sex == 'F'">
                                                <el-icon style="background-color: lightpink;"><Female /></el-icon>
                                            </div>
                                        </el-tag> -->
                                        <el-tag size="small" round type="info" style="border: none; background-color: transparent;" v-if="user.sex != null && user.sex != '' && user.sex != 'N/A'">
                                            <div v-if="user.sex == 'M'">
                                                <el-icon style="background-color: lightblue;"><Male /></el-icon>
                                            </div>
                                            <div v-else-if="user.sex == 'F'">
                                                <el-icon style="background-color: lightpink;"><Female /></el-icon>
                                            </div>
                                        </el-tag>
                                        <!-- remove avatar button -->
                                        <el-popconfirm
                                            title="remove avatar?"
                                            width="100"
                                            @confirm="removeAvatar"
                                        >
                                            <template #reference>
                                                <el-button style="border: none; margin-left: 10px" round plain type="danger" size="small">
                                                    <el-icon><Delete /></el-icon>
                                                </el-button>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                    <!-- appid -->
                                    <div :style="greyTextStyle"> {{ 'appId: ' + user.appId }} </div>
                                </div>
                            </div>
                        </el-descriptions-item>
                        <!-- email -->
                        <el-descriptions-item label="Email">
                            <div> {{ user.email }} </div>
                        </el-descriptions-item>
                        <!-- description -->
                        <el-descriptions-item label="Description">
                            <div> {{ user.description }} </div>
                        </el-descriptions-item>
                        <!-- birthday -->
                        <el-descriptions-item label="Birthday">
                            <div> {{ user.birthday }} </div>
                        </el-descriptions-item>
                        <!-- follows and followers -->
                        <el-descriptions-item label="">
                            <div class="profile-desc-follow">
                                <el-button @click="openFollows('follows')" style="border: none;" round> 
                                    {{ friend.follows.count + ' Follows' }} 
                                </el-button>
                                <el-button @click="openFollowers" style="border: none;" round> 
                                    {{ friend.followers.count + ' Followers' }} 
                                </el-button>
                                <el-button style="border: none;" @click="openModifyInfoDialog" round>
                                    Modify Info
                                </el-button>
                            </div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
                <!-- follows / followers dialog -->
                <el-dialog v-model="friend.visible" width="500px" center>
                    <a-spin :spinning="friend.loading">
                        <FollowsTable
                            :curr-list="friend[friend.currType].list"
                            @update-follow-counts="updateFollowCounts"
                        ></FollowsTable>
                    </a-spin>
                </el-dialog>
                <!-- modify info dialog -->
                <el-dialog v-model="modifyInfoDialog" title="Modify your info" width="500" center>
                    <el-form
                        ref="modifyInfoFormRef"
                        style="max-width: 600px"
                        :model="modifyInfoForm"
                        :rules="modifyInfoFormRules"
                        label-width="auto"
                    >
                        <el-form-item label="Username" prop="username">
                            <el-input v-model="modifyInfoForm.username" />
                        </el-form-item>
                        <el-form-item label="Description" prop="description">
                            <el-input v-model="modifyInfoForm.description" />
                        </el-form-item>
                        <el-form-item label="Sex">
                            <el-radio-group v-model="modifyInfoForm.sex">
                                <el-radio value="M">M</el-radio>
                                <el-radio value="F">F</el-radio>
                                <el-radio value="N/A">N/A</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="Birthday">
                            <el-date-picker
                                v-model="modifyInfoForm.birthday"
                                type="date"
                                placeholder="Pick your birthday"
                                format="YYYY-MM-DD"
                                date-format="YYYY-MM-DD"
                            />
                        </el-form-item>
                        <el-form-item label=" ">
                            <!-- buttons -->
                            <el-button @click="updateInfo" type="primary">Submit</el-button>
                            <el-button @click="() => {this.modifyInfoDialog = false;}">Cancel</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
                <!-- profile tabs -->
                <ProfileTabs class="profile-tabs"></ProfileTabs>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import store from "@/store";
import SideMenu from "../components/SideMenu.vue";
import ProfileTabs from "../components/ProfileTabs.vue";
import FollowsTable from "../components/FollowsTable.vue";
import axios from "axios";
import { created } from "@/main.js";

const url = store.getters.url;

export default {
    name: "ProfilePage",
    components: {
        SideMenu,
        ProfileTabs,
        FollowsTable,
    },
    data() {
        return {
            greyTextStyle: {color: store.getters.greyColor},
            user: JSON.parse(localStorage.getItem("userInfo")),
            modifyInfoDialog: false,
            modifyInfoForm: {},
            modifyInfoFormRules: {
                username: [
                    {required: true, message: "Enter username", trigger: "blur"},
                    {min: 1, max: 50, message: 'Length of username should be between 1 and 50', trigger: ['blur', 'change']}
                ],
                description: [
                    {max: 200, message: 'Length of description is at most 200 characters', trigger: ['blur', 'change']}
                ]
            },
            friend: {
                currType: "follows",
                visible: false,
                follows: {list: [], count: 0, init: false, loading: false, hasMore: true},
                followers: {list: [], count: 0, init: false, loading: false, hasMore: true},
                size: 20,
                loading: false,
            },
        }
    },
    methods: {
        openModifyInfoDialog() {
            Object.keys(this.user).forEach(key => {
                this.modifyInfoForm[key] = this.user[key];
            })
            this.modifyInfoDialog = true;
        },
        updateInfo() {
            this.$refs.modifyInfoFormRef.validate((valid) => {
                if (valid) {
                    if (this.modifyInfoForm.birthday && typeof this.modifyInfoForm.birthday === 'object') {
                        const date = this.modifyInfoForm.birthday;
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const birthday = `${year}-${month}-${day}`;
                        this.modifyInfoForm.birthday = birthday;
                    }
                    axios.put(url + "/api/users", this.modifyInfoForm).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success(res.data.message);
                            Object.keys(this.modifyInfoForm).forEach(key => {
                                this.user[key] = this.modifyInfoForm[key];
                                localStorage.setItem("userInfo", JSON.stringify(this.user));
                            });
                            this.modifyInfoDialog = false;
                        } else {
                            this.$message.error(res.data.message);
                        }
                    })
                } else {
                    this.$message.warning("check your inputs");
                }
            })
        },
        beforeUploadImage(rawFile) {
            const validFormats = ["image/jpeg", "image/png"];
            if (!validFormats.includes(rawFile.raw.type)) {
                this.$message.error('file must be in format of: ' + validFormats);
                return false;
            } else if (rawFile.size / 1024 / 1024 > 2) {
                this.$message.error('image size can not exceed 2MB!')
                return false;
            }
            return true;
        },
        uploadAvatar(file) {
            const pass = this.beforeUploadImage(file);
            if (!pass) {
                return;
            }
            const formData = new FormData();
            formData.append('file', file.raw);
            axios.put(url + "/api/users/avatar", formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((res) => {
                if (res.data.code == 0) {
                    const avatar = res.data.data;
                    const user = JSON.parse(localStorage.getItem("userInfo"));
                    user.avatar = avatar;
                    this.user = user;
                    localStorage.setItem("userInfo", JSON.stringify(user));
                    this.$refs.sideMenuRef.getUserInfo();
                }
            })
        },
        removeAvatar() {
            axios.delete(url + "/api/users/avatar").then(() => {
                const user = JSON.parse(localStorage.getItem("userInfo"));
                user.avatar = "";
                this.user = user;
                localStorage.setItem("userInfo", JSON.stringify(user));
                this.$refs.sideMenuRef.getUserInfo();
            })
        },
        async getLikesRecord() {
            await axios.get(url + "/api/posts/record").then((res) => {
                if (res.data.code === 0) {
                    const data = res.data.data;
                    store.commit("resetLikeMap", data);
                }
            })
        },
        async getFriendMap() {
            await axios.get(url + "/api/users/friends").then((res) => {
                if (res.data.code === 0) {
                    const data = res.data.data;
                    store.commit("resetFriendMap", data);
                }
            })
        },
        updateFollowCounts() {
            ["follows", "followers"].forEach(k => {
                this.friend[k].init = false;
                this.friend[k].count = this.$store.getters.friendMap.get(k).size;
            })
        },
        openFollows(field) {
            this.friend.visible = true;
            this.friend.loading = true;
            if (!this.friend[field].init) {
                axios.get(url + "/api/users/friends/" + field + "?offset=0").then((res) => {
                    if (res.data.code == 0) {
                        const list = res.data.data;
                        this.friend[field].list = [];
                        if (list.length > 0) {
                            this.friend[field].list = this.friend[field].list.concat(list);                  
                            this.friend[field].hasMore = list.length == 20;
                        }
                        this.friend[field].init = true;
                    } else {
                        this.$message.error(res.data.message);
                    }
                    this.friend.currType = field;
                    this.friend.loading = false;
                })
            } else {
                this.friend.currType = field;
                this.friend.loading = false;
            }
        },
        openFollowers() {
            this.openFollows("followers");
        },
    },
    async mounted() {
        await created();
        this.friend.follows.count = this.$store.getters.friendMap.get("follows").size;
        this.friend.followers.count = this.$store.getters.friendMap.get("followers").size;
    },
}
</script>

<style scoped>
.container {
    height: 100vh;
}
.right-side-page {
    margin-top: 30px;
    margin-bottom: 30px;
    margin-left: 100px;
    margin-right: 100px;
    display: grid;
    place-items: center;
}
.profile-description-container {
    width: 80%;
}
.profile-desc-intro {
    display: flex;
}
.profile-desc-personal {
    margin-left: 10px;
    display: grid;
    align-items: center;
}
.profile-desc-name {
    font-size: 20px;
}
.profile-desc-follow {
    display: flex;
    justify-content: space-evenly;
}
.profile-tabs {
    width: 80%;
    margin-top: 20px;
    display: grid;
    place-items: center;
}
</style>
