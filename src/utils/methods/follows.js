import axios from "axios";
import store from "@/store";

const url = store.getters.url;

async function collectFriend(action, friendId) {
    await axios.post(url + "/api/users/friends?action=" + action + "&friendId=" + friendId).then((res) => {
        if (res.data.code == 0 && res.data.data) {
            if (action == "follow") {
                store.commit("addFollows", friendId);
            } else if (action == "unfollow") {
                store.commit("removeFollows", friendId);
            }
        }
    })
}

export async function follow(userId) {
    await collectFriend("follow", userId);
}

export async function unfollow(userId) {
    await collectFriend("unfollow", userId);
}