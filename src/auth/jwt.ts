import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_TTL = Number(process.env.JWT_TTL || 3600); // seconds
const REFRESH_TTL = Number(process.env.REFRESH_TTL || 60 * 60 * 24 * 14); // seconds

export type AccessTokenPayload = {
    sub: string;             // user id
    email: string;
    first_name?: string;
    last_name?: string;
    ver?: number;            // token_version (invalidation serveur)
    iat?: number;
    exp?: number;
    iss?: string;
    aud?: string;
};

export function signAccessToken(payload: Omit<AccessTokenPayload,"iat"|"exp">) {
    return jwt.sign(
        { ...payload, iss: "your-app", aud: "your-app" },
        JWT_SECRET,
        { algorithm: "HS256", expiresIn: JWT_TTL }
    );
}

export function verifyAccessToken<T = AccessTokenPayload>(token: string): T {
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as T;
}

// Refresh token: on ne met QUE le minimum (id + version)
export type RefreshTokenPayload = { sub: string; ver?: number };

export function signRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: REFRESH_TTL });
}