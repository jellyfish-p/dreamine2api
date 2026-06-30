import { assertAdmin } from "../../../utils/admin-auth";
import { deleteAccount } from "~~/server/services/pool/accounts";

export default defineEventHandler((event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  deleteAccount(id);
  return { ok: true };
});