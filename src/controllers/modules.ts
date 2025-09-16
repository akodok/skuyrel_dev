import { Router } from "express";
import { db as dbCaserne } from "../dbCaserne/index.ts";
import {admModuleAcces, modules} from "../dbCaserne/schema.ts";
import { authUtils } from "../utils/authUtils.ts";
import {eq} from "drizzle-orm";


const router = Router();

// Renvoie les modules accèssible pour la caserne.
router.post("/get_module_caserne", async (req, res) => {
    const payload = req.body ?? {};

    if (payload.id_session === ''){
        return res.status(401).json({error:"Aucune session connectée"});
    }

    try {
        const dbDev = await dbCaserne(payload.id_session);
        const all = await dbDev
            .select()
            .from(modules);
        res.json(all);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Problème de récupération des modules de la caserne" });
    }
})

router.post("/get_module_user", async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)){
            return res.status(401).json({error:'Utilisateur non connecté'})
        }

        try {
            const payload = req.body ?? {};

            if (payload.id_session ==='') return res.status(401).json({error:'Aucune session connue'});

            const db = await dbCaserne(payload.id_session);
            const result = await db
                .select()
                .from(admModuleAcces)
                .where(eq(admModuleAcces.idUtilisateur,refUsers));
            res.json(result);

        }catch (err: any){
            return res.status(500).json({error:'Erreur lors de la récupération des modules utilisateur.'})
        }

    }catch (err:any){
        return res.status(401).json({error: err.message});
    }
})

export default router;
