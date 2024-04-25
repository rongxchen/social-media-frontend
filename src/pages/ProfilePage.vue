<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="15%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="85%">
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
                                <el-avatar size="large" :src="user.avatar"></el-avatar>
                                <div class="profile-desc-personal">
                                    <!-- username -->
                                    <div class="profile-desc-name"> 
                                        {{ user.username }} 
                                        <el-tag style="background-color: transparent; border: none;" v-if="user.sex != null && user.sex != '' && user.sex != 'N/A'">
                                            <div v-if="user.sex == 'M'">
                                                <el-icon style="background-color: lightblue;"><Male /></el-icon>
                                            </div>
                                            <div v-else-if="user.sex == 'F'">
                                                <el-icon style="background-color: lightpink;"><Female /></el-icon>
                                            </div>
                                        </el-tag>
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
                                <el-button style="border: none;" round> 
                                    {{ friend.follows.count + ' Follows' }} 
                                </el-button>
                                <el-button style="border: none;" round> 
                                    {{ friend.followers.count + ' Followers' }} 
                                </el-button>
                                <el-button style="border: none;" @click="openModifyInfoDialog" round>
                                    Modify Info
                                </el-button>
                            </div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
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
                <ProfileTabs class="profile-tags-container"></ProfileTabs>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import store from "@/store";
import SideMenu from "../components/SideMenu.vue";
import ProfileTabs from "../components/ProfileTabs.vue";
import axios from "axios";

const url = store.getters.url;

export default {
    name: "ProfilePage",
    components: {
        SideMenu,
        ProfileTabs,
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
                follows: {list: [], count: 0},
                followers: {list: [], count: 0},
            }
        }
    },
    methods: {
        openModifyInfoDialog() {
            this.modifyInfoForm.username = this.user.username;
            this.modifyInfoForm.description = this.user.description;
            this.modifyInfoForm.birthday = this.user.birthday;
            this.modifyInfoForm.sex = this.user.sex;
            this.modifyInfoDialog = true;
        },
        updateInfo() {
            this.$refs.modifyInfoFormRef.validate((valid) => {
                if (valid) {
                    if (this.modifyInfoForm.birthday) {
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
    },
    async created() {
        await this.getFriendMap();
        this.friend.follows.count = store.getters.friendMap.get("follows").size;
        this.friend.followers.count = store.getters.friendMap.get("followers").size;
    },
    async mounted() {
        await this.getLikesRecord();
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
    margin-left: 50px;
    margin-right: 100px;
    display: grid;
    place-items: center;
}
.profile-description-container {
    width: 550px;
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
.profile-tags-container {
    width: 550px;
    margin-top: 30px;
}
</style>
