import type {Request, Response, NextFunction} from "express";
import { verifyAccessToken, type AccessTokenPayload } from "./jwt";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const hdr = req.header("Authorization") || "";
        const m = hdr.match(/^Bearer\s+(.+)$/i);
        if (!m) return res.status(401).json({ error: "Token manquant" });

        const token = m[1];
        const claims = verifyAccessToken<AccessTokenPayload>(token);

        // attache les claims à la requête
        (req as any).user = claims;
        next();
    } catch (e: any) {
        return res.status(401).json({ error: "Token invalide ou expiré", detail: e.message });
    }
}