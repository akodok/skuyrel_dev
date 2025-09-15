import {parseId} from "../helper/parseID.ts";
import {db} from "../db/index.ts";
import {users} from "../db/schema.ts";
import {eq} from "drizzle-orm";
import type {ResultSetHeader} from "mysql2";
import {myEncode} from "../utils/cryptoUtils.ts";
import jwt, {type JwtPayload} from "jsonwebtoken";
import Router from "express";

const router = Router();


// Faire l'appel dans session.ts d'une requete qui retourne au front les accès au module.
// Comme ça à chaque requete il faut que je check si l'utilisateur / utilisateur / rien est admin du module ou pas.
// Donc faire l'appel des bases de données type CIS.
router.post('/add_user', async (req, res) => {
    try {
        // Récupération du header Authorizations
        const authHeader = req.headers.authorization;
        // COMMENTAIRE: Si le header n'existe pas ou ne commence pas par "Bearer", on renvoie une erreur 401 (Unauthorized)
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

        const payload = req.body ?? {};

        const required = [
            "emailUsers",
            "nomUsers",
            "prenomUsers",
            "idSession",
            "statutUsers",
            "matriculeUsers",
        ];

        for (const k of required) {
            if (payload[k] === undefined || payload[k] === null) {
                return res.status(400).json({ error: `Champs manquants: ${k}` });
            }
        }

        const toInsert = {
            emailUsers: String(myEncode(payload.emailUsers)),

        }
        console.log(toInsert)

    }catch (err){
        console.error("[users][create]", err);
        res.status(500).json({ error: "Demande d'accès impossible." });
    }
})

// Suppression d'un utilisateur via son ID (refUsers).
router.delete("/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        const result = await db.delete(users).where(eq(users.refUsers, id));
        const affected = (result as unknown as ResultSetHeader).affectedRows ?? 0;
        if (affected === 0) return res.status(404).json({ error: "User not found" });
        res.json({ ok: true });
    } catch (err) {
        const msg = (err as Error).message === "Invalid ID" ? "Invalid user id" : "Failed to delete user";
        if (msg === "Invalid user id") return res.status(400).json({ error: msg });
        console.error("[users][delete]", err);
        res.status(500).json({ error: 'Suppression impossible.' });
    }
});

export default router;