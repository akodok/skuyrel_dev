// Import des modules nécessaires.
import { eq } from "drizzle-orm";
import { Router } from "express";
import type { ResultSetHeader } from "mysql2";
import { db } from "../dbCenter/index.ts";
import { db as dbCaserne } from "../dbCenter/index.ts";
import { users } from "../dbCenter/schema.ts";
import { users as usersCaserne } from "../dbCaserne/schema.ts";
import { parseId } from "../helper/parseID.ts";

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
            dateFae: users.dateFae,
            dateNaissanceUsers: users.dateNaissanceUsers,
            datePermisAmbulance: users.datePermisAmbulance,
            datePermisUsers: users.datePermisUsers,
            datePswUser: users.datePswUser,
            dateVisiteMedicalUsers: users.dateVisiteMedicalUsers,
            emailUsers: users.emailUsers,
            nomUsers: users.nomUsers,
            permisB: users.permisB,
            permisBe: users.permisBe,
            permisC1E: users.permisC1E,
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

// Création d'un nouvel utilisateur.
router.post("/", async (req, res) => {
  try {
    const payload = req.body ?? {};

    const required = [
      "accreditationUsers",
      "dateNaissanceUsers",
      "datePermisUsers",
      "dateVisiteMedicalUsers",
      "emailUsers",
      "idUsers",
      "nomUsers",
      "prenomUsers",
      "pswdUsers",
    ];

    for (const k of required) {
      if (payload[k] === undefined || payload[k] === null) {
        return res.status(400).json({ error: `Missing field: ${k}` });
      }
    }

    const toInsert = {
      accreditationUsers: Number(payload.accreditationUsers),
      archiveUsers: payload.archiveUsers ?? 0,
      dateFae: payload.dateFae ?? null,
      dateNaissanceUsers: String(payload.dateNaissanceUsers),
      datePermisAmbulance: payload.datePermisAmbulance ?? null,
      datePermisUsers: String(payload.datePermisUsers),
      datePswUser: payload.datePswUser ?? undefined,
      dateVisiteMedicalUsers: String(payload.dateVisiteMedicalUsers),
      emailUsers: String(payload.emailUsers),
      idUsers: String(payload.idUsers),
      nomUsers: String(payload.nomUsers),
      permisB: payload.permisB ?? 0,
      permisBe: payload.permisBe ?? 0,
      permisC1E: payload.permisC1E ?? null,
      photoProfilUser: payload.photoProfilUser ?? null,
      prenomUsers: String(payload.prenomUsers),
      pswdUsers: String(payload.pswdUsers),
    } satisfies Record<string, unknown>;

    const dbDev = await db('skuyrel-dev');
    const result = await dbDev.insert(users).values(toInsert);

    const insertedId = (result as unknown as ResultSetHeader).insertId;

    return res.status(201).json({ id: insertedId, ok: true });
  } catch (err) {
    console.error("[users][create]", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Modification d'un utilisateur existant via son ID (refUsers).
router.patch("/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    const body = req.body ?? {};

    const allowedKeys = new Set([
      "accreditationUsers",
      "archiveUsers",
      "dateFae",
      "dateNaissanceUsers",
      "datePermisAmbulance",
      "datePermisUsers",
      "datePswUser",
      "dateVisiteMedicalUsers",
      "emailUsers",
      "idUsers",
      "nomUsers",
      "permisB",
      "permisBe",
      "permisC1E",
      "photoProfilUser",
      "prenomUsers",
      "pswdUsers",
    ]);
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body)) {
      if (allowedKeys.has(k)) updates[k] = v;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const dbDev = await db('skuyrel-dev');
    const result = await dbDev.update(users).set(updates).where(eq(users.refUsers, id));
    const affected = (result as unknown as ResultSetHeader).affectedRows ?? 0;
    if (affected === 0) return res.status(404).json({ error: "User not found" });

    res.json({ ok: true });
  } catch (err) {
    const msg = (err as Error).message === "Invalid ID" ? "Invalid user id" : "Failed to update user";
    if (msg === "Invalid user id") return res.status(400).json({ error: msg });
    console.error("[users][patch]", err);
    res.status(500).json({ error: msg });
  }
});

export default router;
