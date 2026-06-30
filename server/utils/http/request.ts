import {
  createError,
  getRequestHeader,
  readBody,
  type H3Event,
} from "h3";

export function getAuthorization(event: H3Event): string {
  return getRequestHeader(event, "authorization") || "";
}

export function requireAuthorization(event: H3Event): string {
  const authorization = getAuthorization(event).trim();
  if (!authorization) {
    throw createError({ statusCode: 401, message: "authorization required" });
  }
  return authorization;
}

export async function readJsonBody<T extends Record<string, unknown>>(event: H3Event): Promise<T> {
  const body = await readBody<T | null>(event);
  return (body || {}) as T;
}

export function requiredNumber(value: unknown, name: string): number {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw createError({ statusCode: 400, message: `${name} must be a number` });
  }
  return n;
}
