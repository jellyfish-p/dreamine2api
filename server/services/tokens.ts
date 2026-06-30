import { getCredit, getTokenLiveStatus } from "~~/server/clients/dreamina/core";
import { resolveSessions } from "~~/server/services/pool/auth";
import { resolveCreditProxy } from "~~/server/services/pool/settings";

function maskToken(token: string) {
  return token.length > 8 ? `${token.slice(0, 4)}...${token.slice(-4)}` : "***";
}

export async function checkTokenLive(body: Record<string, unknown>) {
  const token = String(body.token || "").trim();
  if (!token) throw new Error("token required");
  return { live: await getTokenLiveStatus(token) };
}

export async function getTokenPoints(authorization: string) {
  const sessions = resolveSessions(authorization);
  return Promise.all(
    sessions.map(async (session) => ({
      token: maskToken(session.sessionId),
      from_pool: session.fromPool,
      points: await getCredit(session.sessionId, {
        proxyUrl: resolveCreditProxy(session.creditProxy),
      }),
    })),
  );
}
