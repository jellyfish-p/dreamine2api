import { assertAdmin } from "../../../utils/admin-auth";
import { updateAccount } from "@legacy/lib/pool/accounts.ts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  const body = await readBody<{
    label?: string;
    enabled?: boolean;
    proxy_url?: string | null;
    session_id?: string;
  }>(event);
  updateAccount(id, body);
  return { ok: true };
});