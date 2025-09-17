import {db} from "../dbCenter/index.ts";
import {users,accesSession} from "../dbCenter/schema.ts";
import type {ResultSetHeader} from "mysql2";
import {generatePassword, myEncode, sha1} from "../utils/cryptoUtils.ts";
import Router from "express";
import {authUtils} from "../utils/authUtils.ts";
import {sql} from "drizzle-orm";

const router = Router();


// Faire l'appel dans session.ts d'une requete qui retourne au front les accès au module.
// Comme ça à chaque requete il faut que je check si l'utilisateur / utilisateur / rien est admin du module ou pas.
// Donc faire l'appel des bases de données type CIS.
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


        // On vient ajouter l'utilisateur.

    } catch (err) {
        console.error("[users][create]", err);
        res.status(500).json({error: "Demande d'accès impossible."});
    }
})

export default router;