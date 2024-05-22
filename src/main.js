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
app.mount('#app');

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

// initialize friendmap and likemap
const res1 = axios.get(url + "/api/posts/record");
const res2 = axios.get(url + "/api/users/friends");

Promise.all([res1, res2].filter(x => x != null)).then(responses => {
    if (responses[0].data.code === 0) {
        const data = responses[0].data.data;
        store.commit("resetLikeMap", data);
    }
    if (responses[1].data.code === 0) {
        const data = responses[1].data.data;
        store.commit("resetFriendMap", data);
    }
})
