import {db} from "../dbCenter/index.ts";
import {db as dbCaserne} from "../dbCaserne/index.ts";
import {users,accesSession} from "../dbCenter/schema.ts";
import {admModuleAcces} from "../dbCaserne/schema.ts";
import type {ResultSetHeader} from "mysql2";
import {generatePassword, myEncode, sha1} from "../utils/cryptoUtils.ts";
import Router from "express";
import {authUtils} from "../utils/authUtils.ts";
import {eq, sql} from "drizzle-orm";

const router = Router();


// Création d'un utilisateur avec envoie de mail pour le mdp temporaire.
/**
 * TODO: Faire l'envoie de mail quand le serveur sera UP.
 */
router.post('/add_user', async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)) {
            return res.status(401).json({error: 'Utilisateur non connecté'})
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
                return res.status(400).json({error: `Champs manquants: ${k}`});
            }
        }

        // génération d'un MDP sécuriser.
        const storeGenerate = generatePassword();
        const storeSecure = sha1(storeGenerate);

        // Mise en tableau de toutes les datas à envoyer dans la center
        // Après Insert idSession dans acces_session dans la center.
        // Après typeUser dans adm-statut-user dans la caserne.
        const dbDev = await db('skuyrel-dev');

        try {
            const userId = await dbDev.transaction(async (tx) => {
                // 1) Insert user
                type NewUser = typeof users.$inferInsert;

                const toInsert: NewUser = {
                    pswdUsers: storeSecure,
                    nomUsers: myEncode(payload.nomUsers),
                    prenomUsers: myEncode(payload.prenomUsers),
                    emailUsers: myEncode(payload.emailUsers),
                };

                const [resUser] = await tx
                    .insert(users)
                    .values(
                        toInsert
                    );

                const insertedId = (resUser as ResultSetHeader).insertId;

                // 2) Insert accès session (si ça throw -> rollback auto)
                await tx
                    .insert(accesSession)
                    .values({
                    idSession: myEncode(payload.idSession),
                    idUsers: insertedId,
                });
                // 3) insert dans l’AUTRE base du même serveur (nom qualifié)

                await tx.execute(
                    sql`INSERT INTO ${sql.raw(`\`${payload.dbSession}\`.\`adm-statut-user\``)}
                            (\`refUser\`, \`statutUser\`,\`matriculeUser\`)
                        VALUES (${insertedId}, ${payload.statutUsers},${myEncode(payload.matriculeUsers)})`
                );

                // si tout va bien -> commit auto et on retourne l'id
                return insertedId;
            });

            return res.status(201).json({ id: userId, ok: true });
        } catch (err: any) {
            console.error(err);
            // rollback déjà effectué si erreur dans la transaction
            return res.status(400).json({ error: "Échec de la création (rollback effectué)." });
        }
    } catch (err) {
        console.error("[users][create]", err);
        res.status(500).json({error: "Demande d'accès impossible."});
    }
})

// Modification des droits d'accès aux modules.
router.post('/update_droit_acces',async (req, res) => {
    // Vérification de la connexion utilisateur.
    const refUsers = authUtils(req.headers.cookie as string || "");
    // Gestion de la non connexion.
    if (!Number(refUsers)) {
        return res.status(401).json({error: 'Utilisateur non connecté'})
    }

    const payload = req.body ?? {};
    if (payload.id_session ==='') return res.status(401).json({"error": "Aucune session connue"});
    // Il faut faire
    // 1- supprimer tout les accès au modules pour l'user
    // 2- ajouter les modules ADM.
    // 3- ajouter les modules USR.
    const dbDev = await dbCaserne(payload.id_session);

    try {
        const deleted = await  dbDev.transaction(async (tx) => {
            // 1- supprimer tout les accès au modules pour l'user
            const [res] = await tx
                .delete(admModuleAcces)
                .where(eq(admModuleAcces.idUtilisateur, payload.id_user));

            // 2- ajouter les modules ADM.
            const listeAdm = payload.listeAdm.split('-');
            for (let i = 0; i < listeAdm.length; i++) {
                const [addAdm] = await tx
                    .insert(admModuleAcces)
                    .values({
                        idModule: listeAdm[i],
                        idUtilisateur: payload.id_user,
                        superAdminModule: 2,
                        ordreModule: 0
                    })
            }

            // 3- ajouter les modules USR.
            const listeUser = payload.listeUser.split('-');
            for (let i = 0; i < listeUser.length; i++) {
                const [addUser] = await tx
                    .insert(admModuleAcces)
                    .values({
                        idModule: listeUser[i],
                        idUtilisateur: payload.id_user,
                        superAdminModule: 1,
                        ordreModule: 0
                    })
            }
            return { deleted: (res as any).affectedRows };
        });
        // Si on arrive ici : COMMIT a eu lieu
        return res.json({ ok: true, deleted });
    }catch (err:any){
        console.error("Transaction rollback :", err.message);
        return res.status(400).json({ error: "Opération annulée (rollback effectué)." });
    }
})

export default router;