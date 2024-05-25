import store from "@/store";
import axios from "axios";

const url = store.getters.url;

async function fetchNotifications(category, skip) {
    return axios.get(url + "/api/notifications/" + category + "?skip=" + skip);
}

export {
    fetchNotifications,
}
