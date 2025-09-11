import crypto from "crypto";

const key = Buffer.from(process.env.HASH_KEY || "", "hex"); // 32 bytes
const iv = Buffer.from(process.env.HASH_IV || "", "hex");   // 16 bytes

export function myEncode(value: string): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(value, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

export function myDecode(value: string): string {
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(value, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// encode en sha1
export function sha1(value: string): string {
    return crypto.createHash("sha1").update(value).digest("hex");
}