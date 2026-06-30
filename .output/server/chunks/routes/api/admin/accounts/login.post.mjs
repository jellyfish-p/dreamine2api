import { c as defineEventHandler, e as assertAdmin, r as readBody, g as createError, o as loginWithEmail, l as listAccounts, k as updateAccount, h as addAccount } from '../../../../_/nitro.mjs';
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

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  assertAdmin(event);
  const body = await readBody(event);
  if (!((_a = body == null ? void 0 : body.email) == null ? void 0 : _a.trim())) {
    throw createError({ statusCode: 400, message: "email required" });
  }
  if (!(body == null ? void 0 : body.password)) {
    throw createError({ statusCode: 400, message: "password required" });
  }
  let result;
  try {
    result = await loginWithEmail(body.email, body.password, {
      proxyUrl: body.proxy_url
    });
  } catch (e) {
    throw createError({
      statusCode: 502,
      message: (e == null ? void 0 : e.message) || "\u767B\u5F55\u5931\u8D25\uFF1A\u65E0\u6CD5\u8FDE\u63A5 Dreamina passport \u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u4EE3\u7406\u914D\u7F6E"
    });
  }
  const existing = listAccounts().find((a) => a.session_id === result.sessionId);
  const userName = ((_b = result.userInfo) == null ? void 0 : _b.name) || void 0;
  if (existing) {
    updateAccount(existing.id, {
      session_id: result.sessionId,
      label: ((_c = body.label) == null ? void 0 : _c.trim()) || existing.label,
      enabled: true,
      proxy_url: (_d = body.proxy_url) != null ? _d : existing.proxy_url,
      email: body.email,
      password: body.password,
      user_id: result.userId,
      user_name: userName
    });
    return {
      ok: true,
      action: "updated",
      id: existing.id,
      user_id: result.userId
    };
  }
  addAccount(result.sessionId, body.label, body.proxy_url, {
    email: body.email,
    password: body.password,
    userId: result.userId,
    userName
  });
  return {
    ok: true,
    action: "added",
    user_id: result.userId
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
