<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="12%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="88%">
            <div class="right-side-page">
                <!-- image upload -->
                <div class="image-upload-container">
                    <el-upload
                        v-model:file-list="fileList"
                        action="#"
                        :auto-upload="false"
                        drag
                        multiple
                        list-type="picture-card"
                        :on-preview="handlePostImagePreview"
                    ><el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    </el-upload>
                </div>
                <!-- preview image dialog -->
                <el-dialog v-model="previewImageDialog">
                    <img class="preview-image-container" :src="previewingImage" alt="Preview Image" />
                </el-dialog>
                <!-- other details -->
                <el-form 
                    class="post-detail-form" 
                    :model="uploadPost"
                    label-position="top"
                    :rules="uploadPostRules"
                    ref="uploadPostRef"
                >
                    <el-form-item label="Title" prop="title">
                        <el-input 
                            v-model="uploadPost.title" 
                            maxlength="500"
                            show-word-limit
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Content" prop="content">
                        <el-input 
                            v-model="uploadPost.content"
                            type="textarea"
                            rows="6"
                            resize="none"
                            :autosize="false"
                            maxlength="4000"
                            show-word-limit
                            clearable
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="Tags">
                        <el-select
                            v-model="uploadPost.tags"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            :reserve-keyword="false"
                            placeholder="Enter relevant tags for your content"
                        ><el-option
                            v-for="item in []"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <a-spin :spinning="uploadPostLoading">
                    <el-button @click="publishPost" type="primary" round plain>
                        <el-icon><upload /></el-icon>
                        Publish
                    </el-button>
                </a-spin>
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import store from "@/store";
import SideMenu from "../components/SideMenu.vue";
import axios from "axios";
import { created } from "@/main.js";

const url = store.getters.url;

export default {
    name: "AddPostPage",
    components: {
        SideMenu,
    },
    data() {
        return {
            fileList: [],
            uploadPost: { 
                title: "",
                content: "",
                tags: []
            },
            uploadPostLoading: false,
            previewImageDialog: false,
            previewingImage: "",
            uploadPostRules: {
                title: [
                    {required: true, message: "Enter title", trigger: "blur"},
                ],
                content: [
                    {required: true, message: "Enter content", trigger: "blur"},
                ],
            }
        }
    },
    methods: {
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
        handlePostImagePreview(image) {
            this.previewingImage = image.url;
            this.previewImageDialog = true;
        },
        publishPost() {
            this.$refs.uploadPostRef.validate((valid) => {
                if (this.fileList.length == 0) {
                    this.$message.warning("must have at least one image");
                    return;
                }
                for (let file of this.fileList) {
                    const passed = this.beforeUploadImage(file);
                    if (!passed) {
                        return;
                    }
                }
                if (valid) {
                    this.uploadPostLoading = true;
                    const formData = new FormData();
                    for (const file of this.fileList) {
                        formData.append('files', file.raw);
                    }
                    formData.append("post", JSON.stringify(this.uploadPost));
                    axios.post(url + "/api/posts", formData, {
                        headers: {'Content-Type': 'multipart/form-data'}
                    }).then((res) => {
                        if (res.data.code == 0) {
                            this.$message.success("post published");
                            this.uploadPost = {};
                            this.fileList = [];
                        } else {
                            this.$message.error(res.data.message);
                        }
                        this.uploadPostLoading = false;
                    })
                } else {
                    this.$message.warning("check your input");
                }
            })
        },
    },
    mounted() {
        
    },
    async created() {
        await created();
    }
}
</script>

<style scoped>
.container {
    height: 100vh;
}
.right-side-page {
    margin-top: 30px;
    margin-bottom: 50px;
    margin-right: 30px;
    display: grid;
    place-items: center;
}
.image-upload-container {
    margin-bottom: 5%;
}
.preview-image-container {
    width: 500px;
}
.post-detail-form {
    width: 60%;
}
</style>
