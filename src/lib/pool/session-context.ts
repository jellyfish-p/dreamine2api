import type { ResolvedSession } from "@/lib/pool/accounts.ts";
import { pickOneSession } from "@/lib/pool/auth.ts";
import { resolveApiProxy } from "@/lib/pool/settings.ts";

export type ActiveSession = {
  sessionId: string;
  apiProxy?: string;
  creditProxy?: string;
  fromPool: boolean;
  accountId?: number;
};

export function requireActiveSession(authorization?: string): ActiveSession {
  const picked = pickOneSession(authorization);
  if (!picked) {
    throw new Error("未提供有效 Authorization，或号池为空。使用 Bearer <sessionid> 或 Bearer <pool_api_key>");
  }
  return {
    sessionId: picked.sessionId,
    apiProxy: resolveApiProxy(picked.apiProxy),
    creditProxy: picked.creditProxy,
    fromPool: picked.fromPool,
    accountId: picked.accountId,
  };
}