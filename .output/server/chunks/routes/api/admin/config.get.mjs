import { c as defineEventHandler, e as assertAdmin, z as readAppConfig } from '../../../_/nitro.mjs';
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

const config_get = defineEventHandler((event) => {
  assertAdmin(event);
  const cfg = readAppConfig();
  return {
    server: cfg.server,
    system: cfg.system,
    proxy: cfg.proxy,
    pool: { api_key_set: !!cfg.pool.api_key },
    admin: { enabled: cfg.admin.enabled, api_key_set: !!cfg.admin.api_key },
    database: cfg.database
  };
});

export { config_get as default };
//# sourceMappingURL=config.get.mjs.map
