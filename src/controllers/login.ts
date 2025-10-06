// controllers/login.ts

import {eq} from "drizzle-orm";
import { Router } from "express";
import { db } from "../dbCenter/index.ts";
import {users} from "../dbCenter/schema.ts";
import { myEncode, sha1 } from "../utils/cryptoUtils.ts";
import jwt from "jsonwebtoken";

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
        const dbDev = await db('skuyrel-dev');
        const result = await dbDev
            .select({
                emailUsers : users.emailUsers,
                refUsers : users.refUsers,
                pswdUsers : users.pswdUsers,
            })
            .from(users)
            .where(eq(users.emailUsers, emailUsers));

        if (result.length === 0) {
            return res.status(401).json({ error: "Identifiant incorrect." });
        }

        if (result[0].pswdUsers !== pswdUsers) return res.status(401).json({ error: "Mot de passe incorrect." });

        const user = result[0];

        // --- Génération du JWT ---
        const ttl = 60 * 60; // 1h

        const token = jwt.sign(
            {
                sub: user.refUsers,
                email: payload.emailUsers,
                expireIn: ttl,
            },
            process.env.JWT_SECRET as string,
            { algorithm: "HS256" }
        );

        res.cookie("access_token", token, {
          httpOnly: true,
          secure: false,           // true en prod (HTTPS)
          sameSite: "none",
          maxAge: ttl * 1000,
          path: "/",
        });
        return res.json({ ok: true, user: { id: user.refUsers, email: user.emailUsers } });
    } catch (err: any) {
        console.error("Erreur login:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


export default router;