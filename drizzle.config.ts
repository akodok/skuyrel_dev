import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: access is already configured
    url: process.env.DB_URL!,
  },
  dialect: "mysql",
  out: "./drizzle",
  schema: "./src/db/schema.ts",
} satisfies Config;
