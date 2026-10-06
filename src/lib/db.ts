import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * SQLite storage via Node's built-in `node:sqlite` driver — no native build step
 * and no external service to configure, so the site runs immediately after
 * `npm install`. All reads/writes go through `src/lib/queries.ts`, so swapping in
 * Supabase/Postgres later means reimplementing that one module.
 */

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.DATABASE_PATH || path.join(DB_DIR, "app.db");

const SCHEMA_FILE = path.join(process.cwd(), "db", "schema.sql");

declare global {
  // Reused across dev hot-reloads so we never open duplicate handles.
  var __ipsDb: DatabaseSync | undefined;
}

function open() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  // Schema lives in db/schema.sql so the seed script and the app never drift.
  db.exec(fs.readFileSync(SCHEMA_FILE, "utf8"));
  return db;
}

export function getDb(): DatabaseSync {
  if (!globalThis.__ipsDb) globalThis.__ipsDb = open();
  return globalThis.__ipsDb;
}

/** Row values coming out of SQLite are `null | number | string | Uint8Array`. */
type Row = Record<string, unknown>;

export function all<T = Row>(sql: string, params: unknown[] = []): T[] {
  return getDb()
    .prepare(sql)
    .all(...(params as never[])) as T[];
}

export function get<T = Row>(sql: string, params: unknown[] = []): T | undefined {
  return getDb()
    .prepare(sql)
    .get(...(params as never[])) as T | undefined;
}

export function run(sql: string, params: unknown[] = []) {
  return getDb()
    .prepare(sql)
    .run(...(params as never[]));
}

export const DB_FILE = DB_PATH;
