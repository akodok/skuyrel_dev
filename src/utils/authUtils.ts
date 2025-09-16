import jwt, { type JwtPayload } from "jsonwebtoken";

/**
 * Vérifie et décode un token JWT depuis un cookie.
 * @param cookie Cookie contenant access_token=xxxx
 * @returns Le refUsers extrait du token
 * @throws Error si le token est manquant, invalide ou expiré
 */
export function authUtils(cookie: string): number {
    if (!cookie || !cookie.startsWith("access_token")) {
        throw new Error("Token manquant ou invalide");
    }

    const token = cookie.split("=")[1];
    if (!token) {
        throw new Error("Token manquant");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded.sub) {
            throw new Error("Utilisateur introuvable dans le token");
        }
        return Number(decoded.sub);
    } catch {
        throw new Error("Token invalide ou expiré");
    }
}