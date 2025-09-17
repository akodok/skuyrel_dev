import {db} from "../dbCenter/index.ts";
import {db as dbCaserne} from "../dbCaserne/index.ts";
import {users, accesSession} from "../dbCenter/schema.ts";
import {admModuleAcces} from "../dbCaserne/schema.ts";
import type {ResultSetHeader} from "mysql2";
import {generatePassword, myEncode, sha1} from "../utils/cryptoUtils.ts";
import Router from "express";
import {authUtils} from "../utils/authUtils.ts";
import { eq, sql} from "drizzle-orm";

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
                            (\`refUser\`, \`statutUser\`, \`matriculeUser\`)
                        VALUES (${insertedId}, ${payload.statutUsers}, ${myEncode(payload.matriculeUsers)})`
                );

                // si tout va bien -> commit auto et on retourne l'id
                return insertedId;
            });

            return res.status(201).json({id: userId, ok: true});
        } catch (err: any) {
            console.error(err);
            // rollback déjà effectué si erreur dans la transaction
            return res.status(400).json({error: "Échec de la création (rollback effectué)."});
        }
    } catch (err) {
        console.error("[users][create]", err);
        res.status(500).json({error: "Demande d'accès impossible."});
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

// Modification du compte utilisateur.
router.post('/update_user', async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)) {
            return res.status(401).json({error: 'Utilisateur non connecté'})
        }
        const payload = req.body ?? {};
        if (payload.id_session === '') return res.status(401).json({error: "Aucune session connue."});

        // Vérification des données obligatoires.
        const required = [
            "id_session",
            "id_user",
            "prenom_user",
            "nom_user",
            "mail_user",
            "statut_user"
        ]
        // gestion de l'encode des données.
        const prenomUser = myEncode(payload.prenom_user);
        const nomUser = myEncode(payload.nom_user);
        const mailUser = myEncode(payload.mail_user);

        for (const k of required) {
            if (payload[k] === undefined || payload[k] === null) {
                return res.status(400).json({error: `Missing field: ${k}`});
            }
        }
        // Procèdure.
        const dbDev = await db('skuyrel-dev');
        try {
            const [resUser] = await dbDev.transaction(async (tx) => {
                return tx
                    .update(users)
                    .set({
                        prenomUsers: prenomUser,
                        nomUsers: nomUser,
                        emailUsers: mailUser,
                    })
                    .where(eq(users.refUsers, payload.id_user));
            });

            if ((resUser as any).affectedRows === 1){
                return res.json({ ok: true, updated: 1});
            }else{
                return res.json({ ok: true, updated: 'Aucune ligne affectée.' });
            }

        } catch (err: any) {
            console.error(err);
            return res.status(400).json({error: "Échec de la modification (rollback effectué)."});
        }

    } catch (err: any) {
        return res.status(401).json({error: "Utilisateur non connecté."})
    }
})

export default router;