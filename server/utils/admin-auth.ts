import { createError, getRequestHeader, type H3Event } from "h3";
import { readAppConfig } from "../config/app-config";

export function getBearer(event: H3Event): string {
  const auth = getRequestHeader(event, "authorization") || "";
  return auth.replace(/^Bearer\s+/i, "").trim();
}

export function assertAdmin(event: H3Event): void {
  const cfg = readAppConfig();
  if (!cfg.admin.enabled) {
    throw createError({ statusCode: 403, message: "admin panel disabled" });
  }
  const key = cfg.admin.api_key.trim();
  if (!key) {
    throw createError({
      statusCode: 503,
      message: "未配置 admin.api_key（config.toml）",
    });
  }
  const token = getBearer(event);
  if (token !== key) {
    throw createError({ statusCode: 401, message: "unauthorized" });
  }
}
