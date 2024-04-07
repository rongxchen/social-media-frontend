<template>
    <div class="tab-container">
        <!-- tab selection -->
        <div>
            <el-tabs
                v-model="currTab"
                @tab-click="handleTabClick"
            >
                <el-tab-pane v-for="tab in tabs" :key="tab.value" 
                    :label="tab.label" :name="tab.value"
                ></el-tab-pane>
            </el-tabs>
        </div>
        <!-- item list -->
        <div class="card-area">
            <div v-for="item in tabDataList[currTab]" :key="item">
                <PostCard
                    :post="item"
                ></PostCard>
            </div>
        </div>
    </div>
</template>

<script>
import PostCard from "./PostCard.vue"; 

export default {
    components: {
        PostCard
    },
    data() {
        return {
            currTab: "post",
            tabs: [
                {"label": "Posts", "value": "post"},
                {"label": "Favorites", "value": "favorite"},
                {"label": "Likes", "value": "like"}
            ],
            tabDataList: {post: [], favorite: [], like: []},
        }
    },
    methods: {
        handleTabClick(val) {
            const tab = val.props.name;
            console.log(tab);
            
        }
    },
    mounted() {
        
    }
}
</script>

<style>
.tab-container {
    width: 100%;
    display: grid;
    place-items: center;
}
.card-area {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
}
</style>