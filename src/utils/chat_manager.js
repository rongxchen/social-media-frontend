class BaseManager {
    constructor(idField) {
        this.idField = idField;
        this.list = [];
        this.unreadCount = 0;
    }

    init(data) {
        this.list = data;
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
        this.recountUnread();
        return toBeDeleted;
    }

    clear() {
        this.list = [];
        this.unreadCount = 0;
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
        this.recountUnread();
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
        super("notificationId");
    }
}

class FollowsNotificationManager extends BaseManager {
    constructor() {
        super("notificationId");
    }
}

class CommentsNotificationManager extends BaseManager {
    constructor() {
        super("notificationId");
    }
}

export {
    ChatManager,
    LikesNotificationManager,
    FollowsNotificationManager,
    CommentsNotificationManager,   
}
