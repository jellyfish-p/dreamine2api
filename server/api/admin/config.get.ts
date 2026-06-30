import { assertAdmin } from "../../utils/admin-auth";
import { readAppConfig } from "../../config/app-config";

export default defineEventHandler((event) => {
  assertAdmin(event);
  const cfg = readAppConfig();
  return {
    server: cfg.server,
    system: cfg.system,
    proxy: cfg.proxy,
    pool: { api_key_set: !!cfg.pool.api_key },
    admin: { enabled: cfg.admin.enabled, api_key_set: !!cfg.admin.api_key },
    database: cfg.database,
  };
});
