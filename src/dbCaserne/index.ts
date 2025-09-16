import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Connexion de base (sans préciser de DB fixe)
const connectionString = process.env.DB_URL;
if (!connectionString) throw new Error("Missing DB_URL environment variable");

/**
 * Retourne une instance Drizzle pour la base demandée.
 * Exemple : const dbDev = await dbCenter("Skuyrel_dev")
 */
export async function db(database: string) {
    const pool = mysql.createPool({
        uri: connectionString,
        database,
    });

    return drizzle(pool);
}