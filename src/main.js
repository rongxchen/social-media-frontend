import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementPlus from "element-plus"
import * as Icons from '@element-plus/icons'
import "element-plus/dist/index.css"
import 'element-plus/theme-chalk/dark/css-vars.css'
import Antd from "ant-design-vue";
import axios from "axios"

const app = createApp(App).use(router).use(store).use(ElementPlus).use(Antd);
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

axios.interceptors.request.use(
    config => {
        let token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

const url = store.getters.url;
const refreshToken = async () => {
    const REFRESH_TOKEN_URL = url + "/api/users/refresh-token";
    let refreshToken = localStorage.getItem("refreshToken");
    // obtain new token
    return await axios.get(REFRESH_TOKEN_URL, {
        headers: {'refresh-token': "Bearer " + refreshToken}
    }).then((res) => {
        if (res.data.code === 0) {
            let token = res.data.data.accessToken;
            refreshTokenRetry = false;
            return token;
        }
        return null;
    })
}

let refreshTokenRetry = false;
axios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !refreshTokenRetry) {
        refreshTokenRetry = true;
        let accessToken = await refreshToken();
        if (!accessToken) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userInfo");
            return Promise.reject(error);
        }
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        return axios(originalRequest);
    }
    return Promise.reject(error);
});

async function created() {
    const res1 = axios.get(url + "/api/posts/record");
    const res2 = axios.get(url + "/api/users/friends");
    const res3 = axios.get(url + "/api/notifications/likes?skip=0");
    const res4 = axios.get(url + "/api/notifications/comments?skip=0");
    const res5 = axios.get(url + "/api/notifications/follows?skip=0");

    await Promise.all([res1, res2, res3, res4, res5]).then((responses) => {
        const [ record, friend, like, comment, follow ] = responses;
        if (record.data.code == 0) {
            const data = record.data.data;
            store.commit("resetLikeMap", data);
        }
        if (friend.data.code == 0) {
            const data = friend.data.data;
            store.commit("resetFriendMap", data);
        }
        if (like.data.code == 0 && !store.getters.likesNotificationManager.inited) {
            store.getters.likesNotificationManager.init(like.data.data);
        }
        if (comment.data.code == 0 && !store.getters.commentsNotificationManager.inited) {
            store.getters.commentsNotificationManager.init(comment.data.data);
        }
        if (follow.data.code == 0 && !store.getters.followsNotificationManager.inited) {
            store.getters.followsNotificationManager.init(follow.data.data);
        }
    })
}

app.mount('#app');

export {
    created,
}
