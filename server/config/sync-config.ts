import { getDb } from "~~/server/repositories/sqlite/database";
import type { AppConfig } from "./app-config";

const KEYS = {
  GLOBAL_PROXY: "global_proxy_url",
  CREDIT_PROXY: "credit_refresh_proxy_url",
  POOL_API_KEY: "pool_api_key",
} as const;

function now() {
  return Math.floor(Date.now() / 1000);
}

function setSetting(key: string, value: string) {
  getDb()
    .prepare(
      `INSERT INTO app_settings(key, value, updated_at) VALUES(?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .run(key, value, now());
}

export function syncTomlToSqlite(config: AppConfig): void {
  setSetting(KEYS.GLOBAL_PROXY, config.proxy.global_proxy_url.trim());
  setSetting(KEYS.CREDIT_PROXY, config.proxy.credit_refresh_proxy_url.trim());
  setSetting(KEYS.POOL_API_KEY, config.pool.api_key.trim());
}