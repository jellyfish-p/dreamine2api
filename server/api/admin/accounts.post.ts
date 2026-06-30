import { assertAdmin } from "../../utils/admin-auth";
import { addAccount, refreshAccountSnapshot } from "~~/server/services/pool/accounts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody<{ session_id: string; label?: string; proxy_url?: string }>(event);
  if (!body?.session_id?.trim()) {
    throw createError({ statusCode: 400, message: "session_id required" });
  }
  const id = addAccount(body.session_id, body.label, body.proxy_url);
  const snapshot = await refreshAccountSnapshot(id);
  return { ok: true, ...snapshot };
});
