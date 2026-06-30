import { createError } from "h3";
import { dbPath } from "~~/server/repositories/sqlite/database";
import {
  addAccount,
  deleteAccount,
  listAccounts,
  refreshAccountCredit,
  refreshAllCredits,
  refreshAccountSnapshot,
  toPublicAccount,
  updateAccount,
} from "~~/server/services/pool/accounts";
import {
  getPoolApiKey,
  getProxySettings,
  setCreditRefreshProxyUrl,
  setGlobalProxyUrl,
  setPoolApiKey,
} from "~~/server/services/pool/settings";

export function assertPoolAdmin(authorization: string) {
  const key = getPoolApiKey();
  if (!key) {
    throw createError({
      statusCode: 503,
      message: "pool_api_key is not configured",
    });
  }
  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (token !== key) throw createError({ statusCode: 401, message: "pool admin unauthorized" });
}

export function getPoolSettingsResponse(authorization: string) {
  assertPoolAdmin(authorization);
  return { ...getProxySettings(), db_path: dbPath() };
}

export function updatePoolSettings(body: Record<string, unknown>, authorization: string) {
  assertPoolAdmin(authorization);
  if (typeof body.global_proxy_url === "string") setGlobalProxyUrl(body.global_proxy_url);
  if (typeof body.credit_refresh_proxy_url === "string") {
    setCreditRefreshProxyUrl(body.credit_refresh_proxy_url);
  }
  if (typeof body.pool_api_key === "string") setPoolApiKey(body.pool_api_key);
  return getProxySettings();
}

export function getPoolAccountsResponse(authorization: string) {
  assertPoolAdmin(authorization);
  return { data: listAccounts().map(toPublicAccount) };
}

export async function createPoolAccount(body: Record<string, unknown>, authorization: string) {
  assertPoolAdmin(authorization);
  if (typeof body.session_id !== "string" || !body.session_id.trim()) {
    throw createError({ statusCode: 400, message: "session_id required" });
  }
  const id = addAccount(
    body.session_id,
    typeof body.label === "string" ? body.label : "",
    typeof body.proxy_url === "string" ? body.proxy_url : undefined,
  );
  const snapshot = await refreshAccountSnapshot(id);
  return { ok: true, ...snapshot };
}

export function updatePoolAccount(body: Record<string, unknown>, authorization: string) {
  assertPoolAdmin(authorization);
  const id = Number(body.id);
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, message: "id must be a number" });
  updateAccount(id, {
    label: typeof body.label === "string" ? body.label : undefined,
    enabled: typeof body.enabled === "boolean" ? body.enabled : undefined,
    proxy_url: typeof body.proxy_url === "string" ? body.proxy_url : undefined,
    session_id: typeof body.session_id === "string" ? body.session_id : undefined,
  });
  return { ok: true };
}

export function deletePoolAccount(body: Record<string, unknown>, authorization: string) {
  assertPoolAdmin(authorization);
  const id = Number(body.id);
  if (!Number.isFinite(id)) throw createError({ statusCode: 400, message: "id must be a number" });
  deleteAccount(id);
  return { ok: true };
}

export async function refreshPoolAccountCredits(body: Record<string, unknown>, authorization: string) {
  assertPoolAdmin(authorization);
  if (body.id !== undefined) return refreshAccountCredit(Number(body.id));
  return { results: await refreshAllCredits() };
}
