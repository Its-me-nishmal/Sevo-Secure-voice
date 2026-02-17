const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-sevo-key', 'salt', 32);
const IV_LENGTH = 16;

/**
 * Encrypts a buffer and returns the encrypted data with IV prepended
 */
const encrypt = (buffer) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return Buffer.concat([iv, encrypted]);
};

/**
 * Decrypts a buffer (IV + ciphertext)
 */
const decrypt = (buffer) => {
    const iv = buffer.slice(0, IV_LENGTH);
    const encryptedText = buffer.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted;
};

module.exports = {
    encrypt,
    decrypt
};
