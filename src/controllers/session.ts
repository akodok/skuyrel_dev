import jwt, {type JwtPayload} from "jsonwebtoken";
import {db} from "../db/index.ts";
import {accesSession, session} from "../db/schema.ts";
import {and, eq, ne} from "drizzle-orm";
import {Router} from "express";

const router = Router();

router.post("/getSession", async (req, res) => {
    try {
        // Récupération du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
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