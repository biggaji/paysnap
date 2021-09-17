"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const buffer_1 = require("buffer");
/**
 *
 * @param str
 * @returns string In base 64 hash
 */
function encrypt(str) {
    // encrypt incomming str
    let hash = buffer_1.Buffer.from(str, "utf-8").toString("base64");
    return hash;
}
exports.encrypt = encrypt;
/**
 *
 * @param hash
 *
 * @returns string from base 64 hash to string
 */
function decrypt(hash) {
    // decrypt str value
    let encoding = buffer_1.Buffer.from(hash, "base64").toString("utf-8");
    return encoding;
}
exports.decrypt = decrypt;
