import "@legacy/lib/initialize.ts";
import { applyConfigToEnv, readAppConfig } from "../utils/app-config";
import { syncTomlToSqlite } from "../utils/sync-config";

export default defineNitroPlugin(() => {
  const config = readAppConfig();
  applyConfigToEnv(config);
  syncTomlToSqlite(config);
});