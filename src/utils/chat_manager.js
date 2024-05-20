import axios from "axios";
import store from "@/store";

const url = store.getters.url;

const fetchNotoficationHistory = (category) => {
    return axios.get(url + "/api/notifications/" + category).then((res) => {
        return res;
    })
}

class BaseManager {
    constructor(idField) {
        this.idField = idField;
        this.list = [];
        this.unreadCount = 0;
    }

    init(category) {
        fetchNotoficationHistory(category).then((res) => {
            this.list = res.data.data;
        })
        this.recountUnread();
    }

    contains(id) {
        this.getItem(id) != null;
    }

    delete(id, markRead=true) {
        if (markRead) {
            this.markRead(id);
        }
        let toBeDeleted = null;
        const array = [];
        for (const item of this.list) {
            if (item[this.idField] != id) {
                array.push(item);
            } else {
                toBeDeleted = item;
            }
        }
        this.list = array;
        return toBeDeleted;
    }

    pushItemFront(item) {
        this.list = [item].concat(this.list);
        this.unreadCount++;
    }

    markRead(id) {
        for (const item of this.list) {
            if (item[this.idField] == id) {
                this.unreadCount -= item.read ? 0 : 1;
                item.unreadCount = 0;
                break;
            }
        }
    }

    getItem(id) {
        for (const item of this.list) {
            if (item[this.idField] == id) {
                return item;
            }
        }
        return null;
    }

    getList() {
        return this.list;
    }

    getTotalCount() {
        return this.list.length;
    }

    recountUnread() {
        this.unreadCount = 0;
        for (const item of this.list) {
            this.unreadCount += item.read ? 0 : 1;
        }
    }

    getUnreadCount() {
        return this.unreadCount;
    }
}

class ChatManager extends BaseManager {
    constructor() {
        super("chatId");
        super.init("chats");
    }

    pushMessage(chatId, message) {
        const chat = this.delete(chatId, false);
        if (chat) {
            chat.messages.push(message);
            this.pushItemFront(chat);
        }
    }

    markRead(id) {
        for (const item of this.list) {
            if (item[this.idField] == id) {
                this.unreadCount -= item.unreadCount;
                for (let i = item.messages.length-1; i > item.messages.length-1-item.unreadCount; i--) {
                    item.messages[i].read = true;
                }
                item.unreadCount = 0;
                break;
            }
        }
    }

    delete(id, markRead=true) {
        if (markRead) {
            this.markRead(id);
        }
        let toBeDeleted = null;
        const array = [];
        for (const item of this.list) {
            if (item[this.idField] != id) {
                array.push(item);
            } else {
                toBeDeleted = item;
            }
        }
        this.list = array;
        return toBeDeleted;
    }

    getUnreadCount() {
        return this.unreadCount;
    }

    recountUnread() {
        this.unreadCount = 0;
        for (const item of this.list) {
            this.unreadCount += item.unreadCount;
        }
    }
}

class LikesNotificationManager extends BaseManager {
    constructor() {
        super("");
        super.init("likes");
    }
}

class FollowsNotificationManager extends BaseManager {
    constructor() {
        super("");
        super.init("follows");
    }
}

class CommentsNotificationManager extends BaseManager {
    constructor() {
        super("");
        super.init("comments");
    }
}

export {
    ChatManager,
    LikesNotificationManager,
    FollowsNotificationManager,
    CommentsNotificationManager,   
}
