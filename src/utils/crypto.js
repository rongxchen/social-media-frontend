import crypto from 'crypto';

function SHA256(input) {
    return crypto.createHash('sha256')
        .update(input)
        .digest('hex');
}

function SHA512(input) {
    return crypto.createHash('sha256')
        .update(input)
        .digest('hex');
}

function MD5(input) {
    return crypto.createHash('sha256')
        .update(input)
        .digest('hex');
}

export {
    SHA256,
    SHA512,
    MD5,
}
