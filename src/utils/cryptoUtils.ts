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

// Géneration d'un mdp sécurisé pour du temporaire.
function randInt(max: number): number {
    if (typeof crypto.randomInt === "function") {
        return crypto.randomInt(0, max);
    }
    const buf = crypto.randomBytes(4);
    return buf.readUInt32BE(0) % max;
}

export function generatePassword(minAlnum = 8): string {
    const SPECIAL_CHARS = "!@#$%^&*()-_=+[]{};:,.<>/?|~";
    const LETTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const DIGITS = "0123456789";
    const ALPHANUM = LETTERS + DIGITS;

    const chars: string[] = [];

    // ajouter 2 spéciaux
    chars.push(SPECIAL_CHARS.charAt(randInt(SPECIAL_CHARS.length)));
    chars.push(SPECIAL_CHARS.charAt(randInt(SPECIAL_CHARS.length)));

    // garantir au moins 1 lettre et 1 chiffre
    chars.push(LETTERS.charAt(randInt(LETTERS.length)));
    chars.push(DIGITS.charAt(randInt(DIGITS.length)));

    // compléter avec du random alphanumérique
    for (let i = chars.length; i < minAlnum + 2; i++) {
        chars.push(ALPHANUM.charAt(randInt(ALPHANUM.length)));
    }

    // mélanger (Fisher–Yates)
    for (let i = chars.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join("");
}