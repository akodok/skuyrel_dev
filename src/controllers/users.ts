// Import des modules nécessaires.
import {and, count, eq, sql} from "drizzle-orm";
import { Router } from "express";
import { db } from "../dbCenter/index.ts";
import { db as dbCaserne } from "../dbCenter/index.ts";
import {accesSession, users} from "../dbCenter/schema.ts";
import { users as usersCaserne } from "../dbCaserne/schema.ts";
import { parseId } from "../helper/parseID.ts";
import {authUtils} from "../utils/authUtils.ts";
import {generatePassword, myEncode, sha1} from "../utils/cryptoUtils.ts";
import type {ResultSetHeader} from "mysql2";

const router = Router();

// Renvoie la liste complète des utilisateurs.
router.get("/", async (_req, res) => {
    try {
        const dbDev = await db('skuyrel-dev');
        const all = await dbDev.select().from(users);
        res.json(all);
    } catch (err) {
        console.error("[users][list]", err);
        res.status(500).json({error: "Failed to list users"});
    }
});

// Get les utilisateurs présent dans cette session (via la vue).
router.post('/get_by_session', async (req, res) => {
    const payload = req.body ?? {};

    if (payload.id_session === '') {
        return res.status(401).json({error: "Aucune session connectée"});
    }

    try {
        const dbDev = await dbCaserne(payload.id_session);
        const all = await dbDev
            .select()
            .from(usersCaserne);
        res.json(all);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Problème de récupération des utilisateurs" });
    }
})

// Selection d'un utilisateur par son ID (refUsers).
router.get("/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
      const dbDev = await db('skuyrel-dev');
      const rows = await dbDev
        .select({
            accreditationUsers: users.accreditationUsers,
            archiveUsers: users.archiveUsers,
            datePswUser: users.datePswUser,
            emailUsers: users.emailUsers,
            nomUsers: users.nomUsers,
            photoProfilUser: users.photoProfilUser,
            prenomUsers: users.prenomUsers,
            refUsers: users.refUsers
        })
        .from(users).where(eq(users.refUsers, id));
    if (rows.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Identifiant utilisateur invalide" });
  }
});


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
        // Mise en lower email.
        const emailLower = payload.emailUsers.toLowerCase();

        // génération d'un MDP sécuriser.
        const storeGenerate = generatePassword();
        const storeSecure = sha1(storeGenerate);

        // Mise en tableau de toutes les datas à envoyer dans la center
        // Après Insert idSession dans acces_session dans la center.
        // Après typeUser dans adm-statut-user dans la caserne.
        const dbDev = await db('skuyrel-dev');
        try {
            const userId = await dbDev.transaction(async (tx) => {
                // Check de la présence du mail en base de données CENTER.
                const [checkMail] = await tx
                    .select({cnt: count()})
                    .from(users)
                    .where(eq(users.emailUsers,myEncode(emailLower)))

                // si Email déjà connu on stop la fonction.
                if(checkMail.cnt > 0)
                return res.status(400).json({
                    ok: false,
                    message: "Email déjà connu en base de données.",
                    code: "MAIL_UTILISÉ"
                });

                // Vérification si le matricule existe déjà dans la caserne.
                const [checkMatricule] = await tx.execute(
                    sql`SELECT count(*) as cntMatricule
                        FROM ${sql.raw(`\`${payload.dbSession}\`.\`adm-statut-user\``)}
                        WHERE \`matriculeUser\` = ${myEncode(payload.matriculeUsers)}`
                );
                // Si le matricule est déjà connu alors on stop la fonction.
                const cntMatricule = (checkMatricule as any)[0]?.cntMatricule ?? 0;
                if(cntMatricule > 0) return res.status(400).json({
                    ok: false,
                    message: "Le matricule est déjà utilisé.",
                    code: "MATRICULE_UTILISÉ"
                });

                // 1) Insert user
                type NewUser = typeof users.$inferInsert;

                const toInsert: NewUser = {
                    pswdUsers: storeSecure,
                    nomUsers: myEncode(payload.nomUsers),
                    prenomUsers: myEncode(payload.prenomUsers),
                    emailUsers: myEncode(emailLower),
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
            if (!res.headersSent) {
                return res.status(500).json({
                    ok: false,
                    error: err?.message ?? "Internal Server Error",
                    code: err?.code ?? undefined,
                });
            }
        }
    } catch (err) {
        console.error("[users][create]", err);
        res.status(500).json({error: "Demande d'accès impossible."});
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

/*
* Delete user uniquement via les casernes.
* Soit uniquement de l'accès en cas de multicomptes
* Soit total si accèès uniquement
 */

/**
 * TODO:  à revoir car il manque des choses,
 * il faut supprimé le pswd pour que l'user ne puisse pu se connecter.
 * /!\/!\/!\/!\Supprimer des listes de diffusion -> update de la liste de diffusion /!\/!\/!\/!\
 * Supprimer le statut
 *
 */
router.post('/delete_user_caserne', async (req, res) => {
    try {
        // Vérification de la connexion utilisateur.
        const refUsers = authUtils(req.headers.cookie as string || "");
        // Gestion de la non connexion.
        if (!Number(refUsers)) {
            return res.status(401).json({error: 'Utilisateur non connecté'})
        }
        const payload = req.body ?? {};
        if (payload.nom_session === '') return res.status(401).json({error: "Aucune session connue."});

        // Vérification des données obligatoires.
        const required = [
            "id_session",
            "nom_session",
            "id_user"
        ]

        for (const k of required) {
            if (payload[k] === undefined || payload[k] === null) {
                return res.status(400).json({error: `Missing field: ${k}`});
            }
        }
        // Procèdure.
        const dbDev = await db('skuyrel-dev');
        try {
            // 1- On regarde si le compte à plusieurs accès.
            const deleteUser = await dbDev.transaction(async (tx) => {
                const [row] = await tx
                    .select({ cnt: count() })
                    .from(accesSession)
                    .where(eq(accesSession.idUsers, payload.id_user));

                // Si l'utilisateur à plusieurs accès alors on vient uniquement supprimer l'accès à cette session.
                // avec le dbSession
                const nb = Number(row?.cnt ?? 0);

                if(nb > 1){
                    // 2a) supprime seulement le lien avec CETTE session
                    await tx
                        .delete(accesSession)
                        .where(
                            and(
                                eq(accesSession.idUsers, payload.id_user),
                                eq(accesSession.idSession, myEncode(payload.id_session))
                            )
                        );

                    return { mode: "Utilisateur supprimé de la session." };
                }else{
                    // 2b) dernière session → on peut aussi supprimer tous les liens restants
                    const [delAll] = await tx
                        .delete(accesSession)
                        .where(eq(accesSession.idUsers, payload.id_user));

                    const deletedLinks = (delAll as ResultSetHeader).affectedRows ?? 0;

                    // (optionnel) supprimer l'utilisateur
                    // const [delUser] = await tx.delete(users).where(eq(users.refUsers, payload.id_user));
                    // const deletedUsers = (delUser as ResultSetHeader).affectedRows ?? 0;

                    return { mode: "last-session", deletedLinks /*, deletedUsers*/ };
                }

            });

            if ((deleteUser as any).affectedRows === 1){
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
