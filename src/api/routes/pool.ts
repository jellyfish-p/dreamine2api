import _ from "lodash";
import Request from "@/lib/request/Request.ts";
import { getPoolApiKey } from "@/lib/pool/settings.ts";
import {
  getProxySettings,
  setGlobalProxyUrl,
  setCreditRefreshProxyUrl,
  setPoolApiKey,
} from "@/lib/pool/settings.ts";
import {
  addAccount,
  deleteAccount,
  listAccounts,
  refreshAccountCredit,
  refreshAllCredits,
  toPublicAccount,
  updateAccount,
} from "@/lib/pool/accounts.ts";
import { dbPath } from "@/lib/db/index.ts";

function assertPoolAdmin(request: Request) {
  const key = getPoolApiKey();
  if (!key) throw new Error("未配置 pool_api_key，请设置环境变量 DREAMINE_POOL_API_KEY 或 POST /pool/settings");
  const auth = (request.headers?.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (auth !== key) throw new Error("pool admin unauthorized");
}

export default {
  prefix: "/pool",

  get: {
    "/settings": async (request: Request) => {
      assertPoolAdmin(request);
      return { ...getProxySettings(), db_path: dbPath() };
    },

    "/accounts": async (request: Request) => {
      assertPoolAdmin(request);
      return { data: listAccounts().map(toPublicAccount) };
    },
  },

  post: {
    "/settings": async (request: Request) => {
      assertPoolAdmin(request);
      const { global_proxy_url, credit_refresh_proxy_url, pool_api_key } = request.body || {};
      if (_.isString(global_proxy_url)) setGlobalProxyUrl(global_proxy_url);
      if (_.isString(credit_refresh_proxy_url)) setCreditRefreshProxyUrl(credit_refresh_proxy_url);
      if (_.isString(pool_api_key)) setPoolApiKey(pool_api_key);
      return getProxySettings();
    },

    "/accounts": async (request: Request) => {
      assertPoolAdmin(request);
      request.validate("body.session_id", _.isString);
      const { session_id, label, proxy_url } = request.body;
      addAccount(session_id, label, proxy_url);
      return { ok: true };
    },

    "/accounts/update": async (request: Request) => {
      assertPoolAdmin(request);
      request.validate("body.id", _.isFinite);
      const { id, label, enabled, proxy_url, session_id } = request.body;
      updateAccount(Number(id), { label, enabled, proxy_url, session_id });
      return { ok: true };
    },

    "/accounts/delete": async (request: Request) => {
      assertPoolAdmin(request);
      request.validate("body.id", _.isFinite);
      deleteAccount(Number(request.body.id));
      return { ok: true };
    },

    "/accounts/refresh-credit": async (request: Request) => {
      assertPoolAdmin(request);
      if (request.body?.id !== undefined) {
        request.validate("body.id", _.isFinite);
        return refreshAccountCredit(Number(request.body.id));
      }
      return { results: await refreshAllCredits() };
    },
  },
};