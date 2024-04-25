<template>
    <div class="post-detail-container">
        <div v-if="user">
            
        </div>
        <div v-else>
            <el-empty description="post does not exist"></el-empty>
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
            user: {},
        }
    },
    methods: {
        
    },
    created() {
        
    },
    mounted() {
        
    }
}
</script>

<style>

</style>
