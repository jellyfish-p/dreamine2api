import _ from "lodash";
import { tokenSplit } from "~~/server/clients/dreamina/core";
import { getPoolApiKey } from "~~/server/services/pool/settings";
import { pickEnabledAccount, resolveFromPoolAccount } from "~~/server/services/pool/accounts";
import type { ResolvedSession } from "~~/server/services/pool/accounts";

function stripBearer(auth?: string): string {
  if (!auth) return "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}

export function isPoolApiKey(auth?: string): boolean {
  const key = getPoolApiKey();
  if (!key) return false;
  return stripBearer(auth) === key;
}

export function resolveSessions(authorization?: string): ResolvedSession[] {
  if (!authorization) return [];

  if (isPoolApiKey(authorization)) {
    const acc = pickEnabledAccount();
    if (!acc) return [];
    return [resolveFromPoolAccount(acc)];
  }

  const tokens = tokenSplit(authorization);
  return tokens.map((sessionId) => ({
    sessionId,
    fromPool: false,
  }));
}

export function pickOneSession(authorization?: string): ResolvedSession | undefined {
  return _.sample(resolveSessions(authorization));
}