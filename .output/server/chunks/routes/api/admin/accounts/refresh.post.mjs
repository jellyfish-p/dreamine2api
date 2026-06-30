import { c as defineEventHandler, e as assertAdmin, r as readBody, p as refreshAccountCredit, q as refreshAllCredits } from '../../../../_/nitro.mjs';
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

const refresh_post = defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody(event);
  if ((body == null ? void 0 : body.id) !== void 0) {
    return refreshAccountCredit(Number(body.id));
  }
  return { results: await refreshAllCredits() };
});

export { refresh_post as default };
//# sourceMappingURL=refresh.post.mjs.map
