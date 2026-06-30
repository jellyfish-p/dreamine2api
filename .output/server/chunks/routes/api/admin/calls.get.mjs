import { c as defineEventHandler, e as assertAdmin, v as getQuery, w as listApiCalls, x as apiCallStats, y as countApiCalls } from '../../../_/nitro.mjs';
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

const calls_get = defineEventHandler((event) => {
  assertAdmin(event);
  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 50, 200);
  const offset = Number(query.offset) || 0;
  const sinceHours = Number(query.since_hours) || 24;
  const sinceTs = Math.floor(Date.now() / 1e3) - sinceHours * 3600;
  return {
    total: countApiCalls(),
    stats: apiCallStats(sinceTs),
    data: listApiCalls(limit, offset)
  };
});

export { calls_get as default };
//# sourceMappingURL=calls.get.mjs.map
