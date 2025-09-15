import type { Config } from "drizzle-kit";

export default {
    dialect: "mysql",
    out: "./drizzle",
    schema: "./src/dbCenter/schema.ts",
    dbCredentials: {
        url: process.env.DB_URL+'skuyrel_V6_1_CIS_1'
    },
} satisfies Config;