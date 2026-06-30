import { assertAdmin } from "../../utils/admin-auth";
import { addAccount } from "@legacy/lib/pool/accounts.ts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody<{ session_id: string; label?: string; proxy_url?: string }>(event);
  if (!body?.session_id?.trim()) {
    throw createError({ statusCode: 400, message: "session_id required" });
  }
  addAccount(body.session_id, body.label, body.proxy_url);
  return { ok: true };
});