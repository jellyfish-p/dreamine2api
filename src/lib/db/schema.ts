export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS pool_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 1,
  proxy_url TEXT,
  last_total_credit INTEGER,
  last_gift_credit INTEGER,
  last_check_at INTEGER,
  last_success_at INTEGER,
  fail_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  email TEXT,
  password TEXT,
  user_id TEXT,
  user_name TEXT,
  store_country TEXT,
  account_type TEXT,
  last_account_info TEXT,
  vip_level TEXT,
  vip_expire_at TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pool_accounts_enabled ON pool_accounts(enabled);

CREATE TABLE IF NOT EXISTS api_calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  method TEXT NOT NULL,
  model TEXT,
  account_id INTEGER,
  from_pool INTEGER NOT NULL DEFAULT 0,
  status_code INTEGER,
  duration_ms INTEGER,
  error TEXT,
  client_ip TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_calls_created ON api_calls(created_at);
`;

export type PoolAccountRow = {
  id: number;
  session_id: string;
  label: string;
  enabled: number;
  proxy_url: string | null;
  last_total_credit: number | null;
  last_gift_credit: number | null;
  last_check_at: number | null;
  last_success_at: number | null;
  fail_count: number;
  last_error: string | null;
  email: string | null;
  password: string | null;
  user_id: string | null;
  user_name: string | null;
  store_country: string | null;
  account_type: string | null;
  last_account_info: string | null;
  vip_level: string | null;
  vip_expire_at: string | null;
  created_at: number;
  updated_at: number;
};

/**
 * 对已存在的 pool_accounts 表做增量列迁移(兼容旧库)
 * SQLite 不支持 ADD COLUMN IF NOT EXISTS, 需先查 pragma table_info
 */
export const MIGRATION_COLUMNS: { column: string; ddl: string }[] = [
  { column: "email", ddl: "TEXT" },
  { column: "password", ddl: "TEXT" },
  { column: "user_id", ddl: "TEXT" },
  { column: "user_name", ddl: "TEXT" },
  { column: "store_country", ddl: "TEXT" },
  { column: "account_type", ddl: "TEXT" },
  { column: "last_account_info", ddl: "TEXT" },
  { column: "vip_level", ddl: "TEXT" },
  { column: "vip_expire_at", ddl: "TEXT" },
];