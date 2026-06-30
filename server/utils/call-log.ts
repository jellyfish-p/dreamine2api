import { getDb } from "@legacy/lib/db/index.ts";

export type CallLogInput = {
  path: string;
  method: string;
  model?: string;
  accountId?: number;
  fromPool?: boolean;
  statusCode?: number;
  durationMs?: number;
  error?: string;
  clientIp?: string;
};

const INSERT_SQL = `INSERT INTO api_calls(
  path, method, model, account_id, from_pool, status_code, duration_ms, error, client_ip, created_at
) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

export function logApiCall(input: CallLogInput): void {
  const ts = Math.floor(Date.now() / 1000);
  getDb()
    .prepare(INSERT_SQL)
    .run(
      input.path,
      input.method,
      input.model ?? null,
      input.accountId ?? null,
      input.fromPool ? 1 : 0,
      input.statusCode ?? null,
      input.durationMs ?? null,
      input.error ?? null,
      input.clientIp ?? null,
      ts,
    );
}

export function listApiCalls(limit = 100, offset = 0) {
  return getDb()
    .prepare(
      `SELECT id, path, method, model, account_id, from_pool, status_code, duration_ms, error, client_ip, created_at
       FROM api_calls ORDER BY id DESC LIMIT ? OFFSET ?`,
    )
    .all(limit, offset);
}

export function countApiCalls(): number {
  const row = getDb().prepare("SELECT COUNT(*) AS c FROM api_calls").get() as { c: number };
  return row.c;
}

export function apiCallStats(sinceTs: number) {
  return getDb()
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status_code >= 400 OR error IS NOT NULL THEN 1 ELSE 0 END) AS errors,
         AVG(duration_ms) AS avg_ms
       FROM api_calls WHERE created_at >= ?`,
    )
    .get(sinceTs) as { total: number; errors: number; avg_ms: number | null };
}