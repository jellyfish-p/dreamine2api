import { assertAdmin } from "../../../utils/admin-auth";
import { loginWithEmail } from "@legacy/api/controllers/auth.ts";
import {
  addAccount,
  listAccounts,
  updateAccount,
} from "@legacy/lib/pool/accounts.ts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody<{
    email: string;
    password: string;
    label?: string;
    proxy_url?: string;
  }>(event);

  if (!body?.email?.trim()) {
    throw createError({ statusCode: 400, message: "email required" });
  }
  if (!body?.password) {
    throw createError({ statusCode: 400, message: "password required" });
  }

  let result;
  try {
    result = await loginWithEmail(body.email, body.password, {
      proxyUrl: body.proxy_url,
    });
  } catch (e: any) {
    throw createError({
      statusCode: 502,
      message:
        e?.message ||
        "登录失败：无法连接 Dreamina passport 服务，请检查代理配置",
    });
  }

  // 去重：若 session_id 已存在则更新，否则新增
  const existing = listAccounts().find((a) => a.session_id === result.sessionId);
  const userName = (result.userInfo?.name as string) || undefined;
  if (existing) {
    updateAccount(existing.id, {
      session_id: result.sessionId,
      label: body.label?.trim() || existing.label,
      enabled: true,
      proxy_url: body.proxy_url ?? existing.proxy_url,
      email: body.email,
      password: body.password,
      user_id: result.userId,
      user_name: userName,
    });
    return {
      ok: true,
      action: "updated",
      id: existing.id,
      user_id: result.userId,
    };
  }

  addAccount(result.sessionId, body.label, body.proxy_url, {
    email: body.email,
    password: body.password,
    userId: result.userId,
    userName,
  });
  return {
    ok: true,
    action: "added",
    user_id: result.userId,
  };
});
