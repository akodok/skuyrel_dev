// Import des modules nécessaires.
import { eq } from "drizzle-orm";
import { Router } from "express";
import type { ResultSetHeader } from "mysql2";
import { db } from "../db/index.ts";
import { users } from "../db/schema.ts";
import { parseId } from "../helper/parseID.ts";

const router = Router();

// Selection de tous les utilisateurs.
router.get("/", async (_req, res) => {
  try {
    const all = await db.select().from(users);
    res.json(all);
  } catch (err) {
    console.error("[users][list]", err);
    res.status(500).json({ error: "Failed to list users" });
  }
});

// Selection d'un utilisateur par son ID (refUsers).
router.get("/:id", async (req, res) => {
  try {
    const id = parseId(req.params.id);
    const rows = await db
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
            idUsers: users.idUsers,
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

    const result = await db.insert(users).values(toInsert);

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

    const result = await db.update(users).set(updates).where(eq(users.refUsers, id));
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
