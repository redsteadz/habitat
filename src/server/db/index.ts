import "dotenv/config";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

let db: ReturnType<typeof neonDrizzle> | ReturnType<typeof pgDrizzle>;

if (isProduction) {
  const sql = neon(process.env.DATABASE_URL!);
  db = neonDrizzle(sql);
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  db = pgDrizzle(pool);
}

export { db };
