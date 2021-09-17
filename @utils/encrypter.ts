import { Buffer } from 'buffer';

/**
 * 
 * @param str 
 * @returns string In base 64 hash
 */

export function encrypt(str:string) {
    // encrypt incomming str
    let hash = Buffer.from(str, "utf-8").toString("base64");
    return hash;
}

/**
 * 
 * @param hash 
 * 
 * @returns string from base 64 hash to string
 */

export function decrypt(hash:string) {
    // decrypt str value
    let encoding = Buffer.from(hash, "base64").toString("utf-8");
    return encoding;
}