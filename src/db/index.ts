import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connectionString = process.env.DB_URL;
if (!connectionString) throw new Error("Missing DB_URL environment variable");

export const pool = mysql.createPool(connectionString);

export const db = drizzle(pool);
