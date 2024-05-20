import CryptoJS from 'crypto-js';

const SHA256 = (text) => {
    return CryptoJS.SHA256(text).toString();
}

const SHA512 = (text) => {
    return CryptoJS.SHA512(text).toString();
}

const MD5 = (text) => {
    return CryptoJS.MD5(text).toString();
}

export {
    SHA256,
    SHA512,
    MD5,
}
