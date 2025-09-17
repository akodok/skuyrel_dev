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

// Récupère les modules via l'idUser
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

// Modification des droits d'accès aux modules.
router.post('/update_droit_acces', async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)) {
            return res.status(401).json({error: 'Utilisateur non connecté'})
        }

        const payload = req.body ?? {};
        if (payload.id_session === '') return res.status(401).json({"error": "Aucune session connue"});
        // Il faut faire
        // 1- supprimer tout les accès au modules pour l'user
        // 2- ajouter les modules ADM.
        // 3- ajouter les modules USR.
        const dbDev = await dbCaserne(payload.id_session);

        try {
            // type d'insert guidé par le schéma Drizzle
            type Row = typeof admModuleAcces.$inferInsert;

            await dbDev.transaction(async (tx) => {
                // 1) supprimer tous les accès
                await tx
                    .delete(admModuleAcces)
                    .where(eq(admModuleAcces.idUtilisateur, Number(payload.id_user)));

                // helper: "1-2-3" -> ["1","2","3"] (strings), enlève vides / espaces
                const parseIds = (s?: string) =>
                    (s ?? "")
                        .split("-")
                        .map(x => x.trim())
                        .filter(x => x.length > 0);

                const admIds: string[] = parseIds(payload.listeAdm);
                const usrIds: string[] = parseIds(payload.listeUser);

                // 2) insert ADM si il y a des valeurs à inserer
                if (admIds.length) {
                    const rowsAdm: Row[] = admIds.map((id) => ({
                        idModule: id,                              // ← string
                        idUtilisateur: Number(payload.id_user),    // ← number
                        superAdminModule: 2,
                        ordreModule: 0,
                    }));
                    await tx.insert(admModuleAcces).values(rowsAdm);
                }

                // 3) insert USR si il y a des valeurs à inserer
                if (usrIds.length) {
                    const rowsUsr: Row[] = usrIds.map((id) => ({
                        idModule: id,                              // ← string
                        idUtilisateur: Number(payload.id_user),    // ← number
                        superAdminModule: 1,
                        ordreModule: 0,
                    }));
                    await tx.insert(admModuleAcces).values(rowsUsr);
                }

                // rien à return -> commit auto si tout OK
            });
            // Si on arrive ici : COMMIT a eu lieu
            return res.json({ok: true});
        } catch (err: any) {
            console.error("Transaction rollback :", err.message);
            return res.status(400).json({error: "Opération annulée (rollback effectué)."});
        }
    } catch (err: any) {
        return res.status(401).json({error: "Utilisateur non connecté"})
    }
})
export default router;
