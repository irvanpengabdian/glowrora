import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: ".env" });

/**
 * drizzle-kit migrate / push / studio pick a DB client by installed packages.
 * With only `@neondatabase/serverless`, Kit uses Neon over WebSockets (noisy
 * warning; can fail from some local shells). Dev dependency `pg` makes Kit use
 * TCP `pg` instead — same DATABASE_URL as the app (Neon `?sslmode=require`).
 */
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/trustify",
  },
});
