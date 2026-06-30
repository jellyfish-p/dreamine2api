export type AccountTypeInput = {
  account?: Record<string, any> | null;
  commerce?: Record<string, any> | null;
  storeCountry?: string | null;
  previousType?: string | null;
};

export function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (value != null && value !== "") return String(value);
  }
  return null;
}

export function getStringByPath(source: any, path: string[]): string | null {
  let current = source;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
    current = current[key];
  }
  return firstString(current);
}

export function deriveAccountType(input: AccountTypeInput): string {
  const account = input.account || {};
  const commerce = input.commerce || {};

  const explicitType = firstString(
    account.store_geo,
    account.store_vdc,
    getStringByPath(commerce, ["account_type"]),
    getStringByPath(commerce, ["user_type"]),
    getStringByPath(commerce, ["vip_type"]),
    getStringByPath(commerce, ["subscription", "level"]),
    getStringByPath(commerce, ["vip_info", "level"]),
    input.storeCountry,
    input.previousType
  );
  if (explicitType) return explicitType;

  if (isActiveCommerceSubscription(commerce)) return "vip";
  if (isCommerceSubscriptionInfo(commerce)) return "free";
  return "unknown";
}

function isActiveCommerceSubscription(commerce: Record<string, any>): boolean {
  return (
    commerce.flag === true ||
    commerce.is_vip === true ||
    commerce.is_vip === 1 ||
    Boolean(commerce.product_id) ||
    Boolean(commerce.vip_info) ||
    Boolean(commerce.subscription) ||
    commerce.workspace_subscribe_info?.flag === true ||
    Array.isArray(commerce.workspace_subscribe_info?.ongoing_plans) &&
      commerce.workspace_subscribe_info.ongoing_plans.length > 0
  );
}

function isCommerceSubscriptionInfo(commerce: Record<string, any>): boolean {
  return (
    "flag" in commerce ||
    "subscribe_type" in commerce ||
    "subscribe_uid" in commerce ||
    "workspace_subscribe_info" in commerce ||
    "can_free_trial" in commerce
  );
}
