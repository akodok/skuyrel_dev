// controllers/login.ts

import {eq, and, ne} from "drizzle-orm";
import { Router } from "express";
import { db } from "../db/index.ts";
import {accesSession, session, users} from "../db/schema.ts";
import { myEncode, sha1 } from "../utils/cryptoUtils.ts";
import jwt, {type JwtPayload } from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const payload = req.body ?? {};

        const required = ["emailUsers", "pswdUsers"];
        for (const k of required) {
            if (!payload[k]) {
                return res.status(400).json({ error: `Champs manquants: ${k}` });
            }
        }

        const emailUsers = myEncode(payload.emailUsers);
        const pswdUsers = sha1(payload.pswdUsers);

        const result = await db
            .select()
            .from(users)
            .where(and(eq(users.emailUsers, emailUsers), eq(users.pswdUsers, pswdUsers)));

        if (result.length === 0) {
            return res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
        }

        const user = result[0];

        // --- Génération du JWT ---
        const now = Math.floor(Date.now() / 1000);
        const ttl = 60 * 60; // 1h

        const token = jwt.sign(
            {
                sub: user.refUsers,
                email: payload.emailUsers,
                iat: now,
                exp: now + ttl,
            },
            process.env.JWT_SECRET as string,
            { algorithm: "HS256" }
        );

        return res.json({
            token_type: "Bearer",
            access_token: token,
            expires_in: ttl,
            user: {
                id: user.refUsers,
                email: payload.emailUsers,
            },
        });
    } catch (err: any) {
        console.error("Erreur login:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

router.post("/getSession", async (req, res) => {
    try {
        // Récupération du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token manquant ou invalide" });
        }

        const token = authHeader.split(" ")[1];

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        } catch (err) {
            return res.status(401).json({ error: "Token invalide ou expiré" });
        }

        // Ici tu récupères le refUsers du token (on avait mis dans sub au login)
        const refUsers = decoded.sub;
        if (!refUsers) {
            return res.status(400).json({ error: "Utilisateur introuvable dans le token" });
        }

        // Requête Drizzle
        const result = await db
            .select()
            .from(accesSession)
            .innerJoin(session, eq(accesSession.idSession, session.idSession))
            .where(
                and(
                    eq(accesSession.idUsers, Number(refUsers)), // Attention: refUsers est int
                    ne(session.typeSession, "3tD9pEbFNzwApaxx5fTK5w==")
                )
            );

        if (result.length === 0) {
            return res.status(404).json({ error: "Aucune session connue." });
        }

        return res.json({ sessions: result });
    } catch (err) {
        console.error("Erreur getSession:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

export default router;