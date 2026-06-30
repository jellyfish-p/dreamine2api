import fs from "fs";
import { createRequire } from "node:module";
import path from "path";
import type Database from "better-sqlite3";
import { SCHEMA_SQL, MIGRATION_COLUMNS } from "./schema";

const DB_PATH = process.env.DREAMINE_DB_PATH || path.resolve(process.cwd(), "data/dreamine2api.db");
const require = createRequire(path.resolve(process.cwd(), "package.json"));
const BetterSqlite3 = require("better-sqlite3") as {
  new (filename: string): Database.Database;
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = new BetterSqlite3(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(SCHEMA_SQL);
  migratePoolAccounts(db);
  return db;
}

/** 对 pool_accounts 表增量添加缺失列(兼容旧库) */
function migratePoolAccounts(database: Database.Database) {
  const existing = (database.prepare("PRAGMA table_info(pool_accounts)").all() as { name: string }[])
    .map((r) => r.name);
  for (const { column, ddl } of MIGRATION_COLUMNS) {
    if (!existing.includes(column)) {
      database.exec(`ALTER TABLE pool_accounts ADD COLUMN ${column} ${ddl}`);
    }
  }
}

export function dbPath(): string {
  return DB_PATH;
}
