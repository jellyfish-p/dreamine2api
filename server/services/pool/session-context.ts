import type { ResolvedSession } from "~~/server/services/pool/accounts";
import { refreshAccountCredit } from "~~/server/services/pool/accounts";
import { pickOneSession } from "~~/server/services/pool/auth";
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
import { resolveApiProxy } from "~~/server/services/pool/settings";
import logger from "~~/server/utils/logger";

export type ActiveSession = {
  sessionId: string;
  apiProxy?: string;
  creditProxy?: string;
  fromPool: boolean;
  accountId?: number;
};

export function requireActiveSession(authorization?: string, costContext?: CreditCostContext): ActiveSession {
  const picked = pickOneSession(authorization, costContext);
  if (!picked) {
    throw new Error("未提供有效 Authorization，或号池为空。使用 Bearer <pool_api_key>");
  }
  return {
    sessionId: picked.sessionId,
    apiProxy: resolveApiProxy(picked.apiProxy),
    creditProxy: picked.creditProxy,
    fromPool: picked.fromPool,
    accountId: picked.accountId,
  };
}

export async function refreshActiveSessionCredit(session: ActiveSession) {
  if (!session.fromPool || !session.accountId) return;
  try {
    await refreshAccountCredit(session.accountId);
  } catch (e: any) {
    logger.warn(`成功调用后刷新账号 ${session.accountId} 额度失败: ${e?.message || String(e)}`);
  }
}
