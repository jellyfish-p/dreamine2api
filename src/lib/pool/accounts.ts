import _ from "lodash";
import { getDb } from "@/lib/db/index.ts";
import type { PoolAccountRow } from "@/lib/db/schema.ts";
import { getCredit, getTokenLiveStatus, getAccountInfo, getSubscriptionInfo } from "@/api/controllers/core.ts";
import { loginWithEmail } from "@/api/controllers/auth.ts";
import { resolveCreditProxy, resolveApiProxy } from "@/lib/pool/settings.ts";
import logger from "@/lib/logger.ts";

function now() {
  return Math.floor(Date.now() / 1000);
}

function maskSession(s: string) {
  if (s.length <= 8) return "***";
  return `${s.slice(0, 4)}...${s.slice(-4)}`;
}

export function listAccounts(): PoolAccountRow[] {
  return getDb()
    .prepare("SELECT * FROM pool_accounts ORDER BY id ASC")
    .all() as PoolAccountRow[];
}

export function addAccount(
  sessionId: string,
  label = "",
  proxyUrl?: string,
  extra?: { email?: string; password?: string; userId?: string; userName?: string }
) {
  const ts = now();
  getDb()
    .prepare(
      `INSERT INTO pool_accounts(session_id, label, enabled, proxy_url, email, password, user_id, user_name, created_at, updated_at)
       VALUES(?, ?, 1, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      sessionId.trim(),
      label.trim(),
      proxyUrl?.trim() || null,
      extra?.email?.trim() || null,
      extra?.password || null,
      extra?.userId || null,
      extra?.userName || null,
      ts,
      ts
    );
}

export function updateAccount(
  id: number,
  patch: {
    label?: string;
    enabled?: boolean;
    proxy_url?: string | null;
    session_id?: string;
    email?: string;
    password?: string;
    user_id?: string;
    user_name?: string;
  }
) {
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  getDb()
    .prepare(
      `UPDATE pool_accounts SET
        session_id = ?,
        label = ?,
        enabled = ?,
        proxy_url = ?,
        email = ?,
        password = ?,
        user_id = ?,
        user_name = ?,
        updated_at = ?
       WHERE id = ?`
    )
    .run(
      patch.session_id?.trim() || row.session_id,
      patch.label !== undefined ? patch.label : row.label,
      patch.enabled !== undefined ? (patch.enabled ? 1 : 0) : row.enabled,
      patch.proxy_url !== undefined ? patch.proxy_url : row.proxy_url,
      patch.email !== undefined ? patch.email : row.email,
      patch.password !== undefined ? patch.password : row.password,
      patch.user_id !== undefined ? patch.user_id : row.user_id,
      patch.user_name !== undefined ? patch.user_name : row.user_name,
      now(),
      id
    );
}

export function deleteAccount(id: number) {
  getDb().prepare("DELETE FROM pool_accounts WHERE id = ?").run(id);
}

export function getAccountById(id: number): PoolAccountRow | undefined {
  return getDb().prepare("SELECT * FROM pool_accounts WHERE id = ?").get(id) as
    | PoolAccountRow
    | undefined;
}

export function pickEnabledAccount(): PoolAccountRow | undefined {
  const rows = getDb()
    .prepare("SELECT * FROM pool_accounts WHERE enabled = 1 ORDER BY id ASC")
    .all() as PoolAccountRow[];
  if (rows.length === 0) return undefined;
  return _.sample(rows);
}

export async function refreshAccountCredit(id: number) {
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  const creditProxy = resolveCreditProxy(row.proxy_url);
  try {
    const live = await getTokenLiveStatus(row.session_id, { proxyUrl: creditProxy });
    const points = await getCredit(row.session_id, { proxyUrl: creditProxy });
    getDb()
      .prepare(
        `UPDATE pool_accounts SET
          last_total_credit = ?,
          last_gift_credit = ?,
          last_check_at = ?,
          last_success_at = ?,
          fail_count = 0,
          last_error = NULL,
          updated_at = ?
         WHERE id = ?`
      )
      .run(points.totalCredit, points.giftCredit, now(), now(), now(), id);
    return { id, live, points, proxy: creditProxy || null };
  } catch (e: any) {
    getDb()
      .prepare(
        `UPDATE pool_accounts SET last_check_at = ?, fail_count = fail_count + 1, last_error = ?, updated_at = ? WHERE id = ?`
      )
      .run(now(), e?.message || String(e), now(), id);
    throw e;
  }
}

/**
 * 通过账号存储的 email/password 重新登录, 刷新 session_id
 */
export async function refreshSession(id: number) {
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  if (!row.email || !row.password) {
    throw new Error("该账号未存储邮箱密码, 无法刷新 session (仅邮箱登录的账号支持)");
  }
  const apiProxy = resolveApiProxy(row.proxy_url);
  const result = await loginWithEmail(row.email, row.password, { proxyUrl: apiProxy });
  getDb()
    .prepare(
      `UPDATE pool_accounts SET
        session_id = ?,
        user_id = ?,
        user_name = ?,
        fail_count = 0,
        last_error = NULL,
        updated_at = ?
       WHERE id = ?`
    )
    .run(
      result.sessionId,
      result.userId || row.user_id,
      (result.userInfo?.name as string) || row.user_name,
      now(),
      id
    );
  return {
    id,
    session_id: result.sessionId,
    user_id: result.userId || row.user_id,
    user_name: (result.userInfo?.name as string) || row.user_name,
  };
}

/**
 * 获取并持久化账户类型/信息
 *
 * 同时调用:
 *   /passport/account/info/v2  → user_id / name / store_country / store_geo
 *   /commerce/v1/subscription/user_info → vip 等级 / 到期时间
 */
export async function fetchAccountInfo(id: number) {
  const row = getAccountById(id);
  if (!row) throw new Error("account not found");
  const apiProxy = resolveApiProxy(row.proxy_url);
  const info = await getAccountInfo(row.session_id, { proxyUrl: apiProxy });
  const userId = info?.user_id != null ? String(info.user_id) : row.user_id;
  const userName = (info?.name as string) || (info?.screen_name as string) || row.user_name;
  const storeCountry = (info?.store_country as string) || row.store_country;
  // 账户类型: 优先用 store_geo / store_vdc, 兜底 store_country
  const accountType =
    (info?.store_geo as string) || (info?.store_vdc as string) || storeCountry || row.account_type;

  // 订阅/会员信息 (失败不阻断, 仅记日志)
  let vipLevel: string | null = row.vip_level;
  let vipExpireAt: string | null = row.vip_expire_at;
  let subSummary = "";
  try {
    const sub = await getSubscriptionInfo(row.session_id, { proxyUrl: apiProxy });
    vipLevel = extractVipLevel(sub) ?? vipLevel;
    vipExpireAt = extractVipExpire(sub) ?? vipExpireAt;
    subSummary = JSON.stringify(sub).slice(0, 4000);
    logger.info(`账号 ${id} 订阅信息: vip=${vipLevel}, expire=${vipExpireAt}`);
  } catch (e: any) {
    logger.warn(`账号 ${id} 订阅查询失败: ${e?.message}`);
  }

  const mergedInfo = subSummary
    ? JSON.stringify({ account: info, subscription: subSummary }).slice(0, 8000)
    : JSON.stringify(info).slice(0, 8000);

  getDb()
    .prepare(
      `UPDATE pool_accounts SET
        user_id = ?,
        user_name = ?,
        store_country = ?,
        account_type = ?,
        last_account_info = ?,
        vip_level = ?,
        vip_expire_at = ?,
        last_check_at = ?,
        fail_count = 0,
        last_error = NULL,
        updated_at = ?
       WHERE id = ?`
    )
    .run(
      userId,
      userName,
      storeCountry,
      accountType,
      mergedInfo,
      vipLevel,
      vipExpireAt,
      now(),
      now(),
      id
    );
  return {
    id,
    user_id: userId,
    user_name: userName,
    store_country: storeCountry,
    account_type: accountType,
    vip_level: vipLevel,
    vip_expire_at: vipExpireAt,
    email: info?.email || row.email,
    live: !!userId,
  };
}

/**
 * 从订阅信息中提取 VIP 等级标识
 * 兼容多种返回结构
 */
function extractVipLevel(sub: any): string | null {
  if (!sub || typeof sub !== "object") return null;
  const candidates = [
    sub.vip_level,
    sub.level,
    sub.vip_type,
    sub.subscription?.level,
    sub.subscription?.vip_level,
    sub.vip_info?.level,
    sub.vip_info?.vip_level,
  ];
  for (const c of candidates) {
    if (c != null && c !== "" && c !== 0 && c !== "0") return String(c);
  }
  // 有订阅但无等级字段, 标记为 vip
  if (sub.vip_info || sub.subscription || sub.is_vip === 1 || sub.is_vip === true) {
    return "vip";
  }
  return null;
}

/**
 * 从订阅信息中提取 VIP 到期时间 (统一转成可读字符串)
 */
function extractVipExpire(sub: any): string | null {
  if (!sub || typeof sub !== "object") return null;
  const candidates = [
    sub.vip_expire_at,
    sub.expire_at,
    sub.expiry_time,
    sub.end_time,
    sub.expiration_time,
    sub.subscription?.expire_at,
    sub.subscription?.expiry_time,
    sub.vip_info?.expire_at,
    sub.vip_info?.expiry_time,
  ];
  for (const c of candidates) {
    if (c == null || c === "" || c === 0) continue;
    // 秒级时间戳 → 可读
    if (typeof c === "number" && c > 1e9) {
      return new Date(c * 1000).toISOString().replace("T", " ").slice(0, 19) + " UTC";
    }
    return String(c);
  }
  return null;
}

export async function refreshAllCredits() {
  const accounts = listAccounts();
  const results = [];
  for (const a of accounts) {
    try {
      const r = await refreshAccountCredit(a.id);
      results.push({ id: a.id, ok: true, ...r });
    } catch (e: any) {
      results.push({ id: a.id, ok: false, error: e?.message || String(e) });
    }
  }
  return results;
}

export function toPublicAccount(row: PoolAccountRow) {
  return {
    id: row.id,
    session_mask: maskSession(row.session_id),
    label: row.label,
    enabled: !!row.enabled,
    proxy_url: row.proxy_url,
    last_total_credit: row.last_total_credit,
    last_gift_credit: row.last_gift_credit,
    last_check_at: row.last_check_at,
    last_success_at: row.last_success_at,
    fail_count: row.fail_count,
    last_error: row.last_error,
    email: row.email,
    user_id: row.user_id,
    user_name: row.user_name,
    store_country: row.store_country,
    account_type: row.account_type,
    vip_level: row.vip_level,
    vip_expire_at: row.vip_expire_at,
    has_password: !!row.password,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export type ResolvedSession = {
  sessionId: string;
  accountId?: number;
  apiProxy?: string;
  creditProxy?: string;
  fromPool: boolean;
};

export function resolveFromPoolAccount(row: PoolAccountRow): ResolvedSession {
  return {
    sessionId: row.session_id,
    accountId: row.id,
    apiProxy: row.proxy_url || undefined,
    creditProxy: row.proxy_url || undefined,
    fromPool: true,
  };
}