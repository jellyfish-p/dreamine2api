import { applyConfigToEnv, readAppConfig } from "../config/app-config";
import { syncTomlToSqlite } from "../config/sync-config";
import { getDb } from "../repositories/sqlite/database";
import logger from "../utils/logger";

export default defineNitroPlugin(() => {
  const state = globalThis as typeof globalThis & { __dreamineServerInitialized?: boolean };
  if (state.__dreamineServerInitialized) return;
  state.__dreamineServerInitialized = true;

  const config = readAppConfig();
  applyConfigToEnv(config);
  syncTomlToSqlite(config);
  getDb();
  logger.info("Dreamine Nitro backend initialized");
});
