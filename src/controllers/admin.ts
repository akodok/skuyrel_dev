import router from "@controllers/users.ts";
import {parseId} from "../helper/parseID.ts";
import {db} from "@db/index.ts";
import {users} from "@db/schema.ts";
import {eq} from "drizzle-orm";
import type {ResultSetHeader} from "mysql2";

router.post('/demandeAcces', async (req, res) => {
    try {
        const payload = req.body ?? {};

        const required = [
            "emailUsers",
            "nomUsers",
            "prenomUsers",
            "pswdUsers",
            "confirmPswdUsers",
        ];

        for (const k of required) {
            if (payload[k] === undefined || payload[k] === null) {
                return res.status(400).json({ error: `Missing field: ${k}` });
            }
        }

        if (payload.pswdUser === payload.confirmPswdUsers){
            res.status(404).json({ ok: true });
        }

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