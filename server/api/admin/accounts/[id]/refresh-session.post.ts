import { assertAdmin } from "../../../../utils/admin-auth";
import { refreshSession } from "~~/server/services/pool/accounts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  try {
    return await refreshSession(id);
  } catch (e: any) {
    throw createError({ statusCode: 502, message: e?.message || "刷新 session 失败" });
  }
});
