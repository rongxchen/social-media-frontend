import { SHA256 } from "../encryption";
import { generateUUID } from "../uuid";
import store from "@/store";

function createP2PChat(user1, user2) {
    const chatId = generateChatId(user1.appId, user2.appId);
    let found = false;
    for (const chat of store.getters.chats.has(chatId)) {
        if (chat.chatId == chatId) {
            found = true;
            break;
        }
    }
    if (found) {
        return;
    }
    const chat = {
        "chatId": chatId,
        "users": [user1, user2],
        "messages": [],
        "createTimestamp": new Date().getTime(),
        "metaData": {},
        "unreadCount": 0,
    }
    return chat;
}

function createGroupChat(users) {
    const chatId = generateUUID();
    const chat = {
        "chatId": chatId,
        "users": users,
        "messages": [],
        "createTime": "",
        "metaData": {},
        "unreadCount": 0,
    }
    return chat;
}

function generateChatId(appId1, appId2) {
    let former, later;
    if (appId1 >= appId2) {
        former = appId1;
        later = appId2;
    } else {
        former = appId2;
        later = appId1;
    }
    let hash = SHA256(former + later);
    return hash + former.substring(0, 4) + later.substring(0, 4);
}

export {
    createP2PChat,
    createGroupChat,
    generateChatId,
}
