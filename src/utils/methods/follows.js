import axios from "axios";
import store from "@/store";

const url = store.getters.url;

async function collectFriend(action, friendId) {
    if (action == "follow") {
        store.commit("addFollows", friendId);
    } else if (action == "unfollow") {
        store.commit("removeFollows", friendId);
    }
    return axios.post(url + "/api/users/friends?action=" + action + "&friendId=" + friendId).then((res) => {
        return res;
    })
}

export async function follow(userId) {
    await collectFriend("follow", userId);
}

export async function unfollow(userId) {
    await collectFriend("unfollow", userId);
}