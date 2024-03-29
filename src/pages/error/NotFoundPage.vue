<template>
    <div class="not-found-container">
        <el-empty description="Not Found"></el-empty>
        <el-button @click="back" type="primary">Back</el-button>
    </div>
</template>

<script>
export default {
    name: "NotFoundPage",
    data() {
        return {
            backPath: this.$router.currentRoute.value.query.backPath || "/login",
        }
    },
    methods: {
        back() {
            this.$router.push(this.backPath);
        }
    },
    mounted() {

    }
}
</script>

<style>
.not-found-container {
    display: grid;
    place-items: center;
}
</style>
