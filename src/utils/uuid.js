import { v4 as uuidv4 } from "uuid";

const generateUUID = (prefix=null) => {
    let id = uuidv4();
    if (prefix) {
        id = prefix + "-" + id;
    }
    return id;
}

export {
    generateUUID,
}
