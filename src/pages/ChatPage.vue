<template>
    <el-container class="container">
        <!-- side menu -->
        <el-aside width="15%">
            <SideMenu></SideMenu>
        </el-aside>
        <!-- right hand side page -->
        <el-aside width="85%">
            <div class="right-side-page">
                
            </div>
        </el-aside>
    </el-container>
</template>

<script>
import SideMenu from "../components/SideMenu.vue";

export default {
    name: "ChatPage",
    components: {
        SideMenu,
    },
    data() {
        return {

        }
    },
    methods: {
    }
}
</script>

<style>

</style>
