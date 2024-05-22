import { SHA256 } from "../encryption";

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
    generateChatId,
}
