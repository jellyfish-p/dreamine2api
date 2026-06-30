import { assertAdmin } from "../../../../utils/admin-auth";
import { fetchAccountInfo } from "@legacy/lib/pool/accounts.ts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const id = Number(getRouterParam(event, "id"));
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, message: "invalid id" });
  }
  try {
    return await fetchAccountInfo(id);
  } catch (e: any) {
    throw createError({ statusCode: 502, message: e?.message || "获取账户信息失败" });
  }
});
