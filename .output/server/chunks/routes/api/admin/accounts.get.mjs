import { c as defineEventHandler, e as assertAdmin, l as listAccounts, f as toPublicAccount } from '../../../_/nitro.mjs';
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

const accounts_get = defineEventHandler((event) => {
  assertAdmin(event);
  return { data: listAccounts().map(toPublicAccount) };
});

export { accounts_get as default };
//# sourceMappingURL=accounts.get.mjs.map
