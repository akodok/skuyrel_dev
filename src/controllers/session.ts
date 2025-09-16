import {db} from "../dbCenter/index.ts";
import {accesSession, session} from "../dbCenter/schema.ts";
import {and, eq, ne} from "drizzle-orm";
import {Router} from "express";
import {authUtils} from "../utils/authUtils.ts";
import {myEncode} from "../utils/cryptoUtils.ts";

const router = Router();

router.post("/get_session_by_id", async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)){
            return res.status(401).json({error:'Utilisateur non connecté'})
        }

        // Requête Drizzle
         const dbDev = await db('skuyrel-dev');
         const result = await dbDev
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

// Récupération des infos de la session via son ID.
router.post("/get_info_session", async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)){
            return res.status(401).json({error:'Utilisateur non connecté'})
        }

        const payload = req.body ?? {};
        if (payload.id_session === '') return res.status(401).json({error:"Aucune session connue."})
        console.log(myEncode(payload.id_session));
        // Requête Drizzle
        const dbDev = await db('skuyrel-dev');
        const result = await dbDev
            .select()
            .from(session)
            .where(
                eq(session.idSession, myEncode(payload.id_session)) // Attention: refUsers est int
            );

        if (result.length === 0) {
            return res.status(404).json({ error: "Aucune session." });
        }

        return res.json({ sessions: result });
    } catch (err) {
        console.error("Erreur getSession:", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
    }
})

export default router;