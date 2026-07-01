import _ from "lodash";
import { getPoolApiKey } from "~~/server/services/pool/settings";
import { resolveFromPoolAccount } from "~~/server/services/pool/accounts";
import type { ResolvedSession } from "~~/server/services/pool/accounts";
import type { CreditCostContext } from "~~/server/services/pool/credit-cost";
import { pickAccountForCost } from "~~/server/services/pool/scheduler";

function stripBearer(auth?: string): string {
  if (!auth) return "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}

export function isPoolApiKey(auth?: string): boolean {
  const key = getPoolApiKey();
  if (!key) return false;
  return stripBearer(auth) === key;
}

export function resolveSessions(authorization?: string, costContext?: CreditCostContext): ResolvedSession[] {
  if (!authorization) return [];

  if (isPoolApiKey(authorization)) {
    const acc = pickAccountForCost(costContext);
    if (!acc) return [];
    return [resolveFromPoolAccount(acc)];
  }

  return [];
}

export function pickOneSession(authorization?: string, costContext?: CreditCostContext): ResolvedSession | undefined {
  return _.sample(resolveSessions(authorization, costContext));
}
