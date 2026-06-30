import { assertAdmin } from "../../utils/admin-auth";
import {
  applyConfigToEnv,
  mergeConfig,
  readAppConfig,
  writeAppConfig,
  type AppConfig,
} from "../../utils/app-config";
import { syncTomlToSqlite } from "../../utils/sync-config";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody<Partial<AppConfig>>(event);
  const current = readAppConfig();
  const patch = { ...body };
  if (patch.pool && !patch.pool.api_key) {
    patch.pool = { ...current.pool, ...patch.pool, api_key: current.pool.api_key };
  }
  if (patch.admin && !patch.admin.api_key) {
    patch.admin = { ...current.admin, ...patch.admin, api_key: current.admin.api_key };
  }
  const next = mergeConfig(current, patch);
  writeAppConfig(next);
  applyConfigToEnv(next);
  syncTomlToSqlite(next);
  return { ok: true };
});