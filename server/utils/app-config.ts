import fs from "node:fs";
import path from "node:path";
import * as TOML from "smol-toml";

export type AppConfig = {
  server: {
    name: string;
    host: string;
    port: number;
  };
  system: {
    request_log: boolean;
    tmp_dir: string;
    log_dir: string;
    public_dir: string;
  };
  proxy: {
    global_proxy_url: string;
    credit_refresh_proxy_url: string;
  };
  pool: {
    api_key: string;
  };
  admin: {
    api_key: string;
    enabled: boolean;
  };
  database: {
    path: string;
  };
};

const DEFAULT_CONFIG: AppConfig = {
  server: { name: "dreamine2api", host: "0.0.0.0", port: 5200 },
  system: {
    request_log: true,
    tmp_dir: "./tmp",
    log_dir: "./logs",
    public_dir: "./public",
  },
  proxy: { global_proxy_url: "", credit_refresh_proxy_url: "" },
  pool: { api_key: "" },
  admin: { api_key: "", enabled: true },
  database: { path: "data/dreamine2api.db" },
};

export function configFilePath(): string {
  return path.resolve(process.cwd(), "config.toml");
}

export function readAppConfig(): AppConfig {
  const file = configFilePath();
  if (!fs.existsSync(file)) {
    writeAppConfig(DEFAULT_CONFIG);
    return structuredClone(DEFAULT_CONFIG);
  }
  const raw = TOML.parse(fs.readFileSync(file, "utf8")) as Partial<AppConfig>;
  return mergeConfig(DEFAULT_CONFIG, raw);
}

export function writeAppConfig(config: AppConfig): void {
  const file = configFilePath();
  const doc = {
    server: config.server,
    system: config.system,
    proxy: config.proxy,
    pool: config.pool,
    admin: config.admin,
    database: config.database,
  };
  fs.writeFileSync(file, TOML.stringify(doc), "utf8");
}

export function mergeConfig(base: AppConfig, patch: Partial<AppConfig>): AppConfig {
  return {
    server: { ...base.server, ...patch.server },
    system: { ...base.system, ...patch.system },
    proxy: { ...base.proxy, ...patch.proxy },
    pool: { ...base.pool, ...patch.pool },
    admin: { ...base.admin, ...patch.admin },
    database: { ...base.database, ...patch.database },
  };
}

export function applyConfigToEnv(config: AppConfig): void {
  if (config.database.path) {
    process.env.DREAMINE_DB_PATH = path.resolve(process.cwd(), config.database.path);
  }
  if (config.proxy.global_proxy_url) {
    process.env.DREAMINE_GLOBAL_PROXY = config.proxy.global_proxy_url;
  }
  if (config.proxy.credit_refresh_proxy_url) {
    process.env.DREAMINE_CREDIT_PROXY = config.proxy.credit_refresh_proxy_url;
  }
  if (config.pool.api_key) {
    process.env.DREAMINE_POOL_API_KEY = config.pool.api_key;
  }
}