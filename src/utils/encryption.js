import CryptoJS from 'crypto-js';

const SHA256 = (text) => {
    return CryptoJS.SHA256(text).toString();
}

export {
    SHA256
}
