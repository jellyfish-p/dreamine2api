import { c as defineEventHandler, e as assertAdmin, i as getRouterParam, g as createError, n as refreshSession } from '../../../../../_/nitro.mjs';
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

const refreshSession_post = defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  try {
    return await refreshSession(id);
  } catch (e) {
    throw createError({ statusCode: 502, message: (e == null ? void 0 : e.message) || "\u5237\u65B0 session \u5931\u8D25" });
  }
});

export { refreshSession_post as default };
//# sourceMappingURL=refresh-session.post.mjs.map
