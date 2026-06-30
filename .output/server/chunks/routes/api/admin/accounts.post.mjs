import { c as defineEventHandler, e as assertAdmin, r as readBody, g as createError, h as addAccount } from '../../../_/nitro.mjs';
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

const accounts_post = defineEventHandler(async (event) => {
  var _a;
  assertAdmin(event);
  const body = await readBody(event);
  if (!((_a = body == null ? void 0 : body.session_id) == null ? void 0 : _a.trim())) {
    throw createError({ statusCode: 400, message: "session_id required" });
  }
  addAccount(body.session_id, body.label, body.proxy_url);
  return { ok: true };
});

export { accounts_post as default };
//# sourceMappingURL=accounts.post.mjs.map
