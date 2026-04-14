import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cache: Db | undefined;

/** Neon + Drizzle; throws if `DATABASE_URL` is missing (call from server only). */
export function getDb(): Db {
  if (cache) return cache;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env for Neon connectivity.",
    );
  }
  cache = drizzle(neon(url), { schema });
  return cache;
}

export * from "./schema";
