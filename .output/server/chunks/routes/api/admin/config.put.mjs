import { c as defineEventHandler, e as assertAdmin, r as readBody, z as readAppConfig, A as mergeConfig, B as writeAppConfig, C as applyConfigToEnv, D as syncTomlToSqlite } from '../../../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'smol-toml';
import 'fs';
import 'node:module';
import 'path';
import 'node:url';
import 'lodash';
import 'assert';
import 'util';
import 'fs-extra';
import 'date-fns';
import 'yaml';
import 'minimist';
import 'os';
import 'crypto';
import 'stream';
import 'mime';
import 'axios';
import 'crc-32';
import 'randomstring';
import 'cron';
import 'https-proxy-agent';
import 'socks-proxy-agent';
import '@iconify/utils';
import 'node:crypto';
import 'consola';

const config_put = defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody(event);
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

export { config_put as default };
//# sourceMappingURL=config.put.mjs.map
