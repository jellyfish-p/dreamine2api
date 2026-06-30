import _ from "lodash";
import { tokenSplit } from "@/api/controllers/core.ts";
import { getPoolApiKey } from "@/lib/pool/settings.ts";
import { pickEnabledAccount, resolveFromPoolAccount } from "@/lib/pool/accounts.ts";
import type { ResolvedSession } from "@/lib/pool/accounts.ts";

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