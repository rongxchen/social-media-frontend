import store from "@/store";
import axios from "axios";

const url = store.getters.url;

export async function likePost(post) {
    let action;
    if (store.getters.likeMap.get("likes").has(post.postId)) {
        post.likeCount --;
        store.getters.likeMap.get("likes").delete(post.postId);
        action = "cancel";
    } else {
        post.likeCount ++;
        store.getters.likeMap.get("likes").set(post.postId, 1);
        action = "collect";
    }
    axios.post(url + "/api/posts/like-post?postId=" + post.postId + "&ownerId=" + post.authorId + "&action=" + action).then((res) => {
        return res;
    })
}

export async function deletePost(postId) {
    return axios.delete(url + "/api/posts?postId=" + postId).then((res) => {
        return res;
    })
}

export async function favoritePost(post) {
    let action;
    if (store.getters.likeMap.get("favorites").has(post.postId)) {
        post.favoriteCount --;
        store.getters.likeMap.get("favorites").delete(post.postId);
        action = "cancel";
    } else {
        post.favoriteCount ++;
        store.getters.likeMap.get("favorites").set(post.postId, 1);
        action = "collect";
    }
    axios.post(url + "/api/posts/favorite-post?postId=" + post.postId + "&ownerId=" + post.authorId + "&action=" + action).then((res) => {
        return res;
    })
}