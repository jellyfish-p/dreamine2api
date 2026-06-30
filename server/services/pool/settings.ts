import { getDb } from "~~/server/repositories/sqlite/database";

const KEYS = {
  GLOBAL_PROXY: "global_proxy_url",
  CREDIT_PROXY: "credit_refresh_proxy_url",
  POOL_API_KEY: "pool_api_key",
} as const;

function now() {
  return Math.floor(Date.now() / 1000);
}

function getSetting(key: string): string {
  const row = getDb().prepare("SELECT value FROM app_settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? "";
}

function setSetting(key: string, value: string) {
  getDb()
    .prepare(
      `INSERT INTO app_settings(key, value, updated_at) VALUES(?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .run(key, value, now());
}

export function getGlobalProxyUrl(): string | undefined {
  const v = getSetting(KEYS.GLOBAL_PROXY);
  return v || process.env.DREAMINE_GLOBAL_PROXY || undefined;
}

export function getCreditRefreshProxyUrl(): string | undefined {
  const v = getSetting(KEYS.CREDIT_PROXY);
  return v || process.env.DREAMINE_CREDIT_PROXY || undefined;
}

export function setGlobalProxyUrl(url: string) {
  setSetting(KEYS.GLOBAL_PROXY, url.trim());
}

export function setCreditRefreshProxyUrl(url: string) {
  setSetting(KEYS.CREDIT_PROXY, url.trim());
}

export function getPoolApiKey(): string {
  return getSetting(KEYS.POOL_API_KEY) || process.env.DREAMINE_POOL_API_KEY || "";
}

export function setPoolApiKey(key: string) {
  setSetting(KEYS.POOL_API_KEY, key.trim());
}

export function getProxySettings() {
  return {
    global_proxy_url: getGlobalProxyUrl() || "",
    credit_refresh_proxy_url: getCreditRefreshProxyUrl() || "",
    pool_api_key_set: !!getPoolApiKey(),
    db_path: process.env.DREAMINE_DB_PATH || "",
  };
}

export function resolveApiProxy(accountProxy?: string | null): string | undefined {
  return accountProxy?.trim() || getGlobalProxyUrl();
}

export function resolveCreditProxy(accountProxy?: string | null): string | undefined {
  return getCreditRefreshProxyUrl() || accountProxy?.trim() || getGlobalProxyUrl();
}