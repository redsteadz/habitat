import {
  drizzle as neonDrizzle,
  NeonHttpDatabase,
} from "drizzle-orm/neon-http";
import {
  drizzle as pgDrizzle,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

// USE a type that knows about the schema
type DB = NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>;

let db: DB;

if (isProduction) {
  const sql = neon(process.env.DATABASE_URL!);
  db = neonDrizzle(sql, { schema });
} else {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  db = pgDrizzle(pool, { schema });
}

export { db };
