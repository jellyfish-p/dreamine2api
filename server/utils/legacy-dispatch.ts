import {
  getQuery,
  getRequestHeaders,
  getRequestIP,
  getRequestURL,
  send,
  sendRedirect,
  sendStream,
  setResponseHeader,
  setResponseStatus,
  type H3Event,
} from "h3";
import Request from "@legacy/lib/request/Request.ts";
import Response from "@legacy/lib/response/Response.ts";
import FailureBody from "@legacy/lib/response/FailureBody.ts";
import Body from "@legacy/lib/response/Body.ts";
import routes from "@legacy/api/routes/index.ts";
import { logApiCall } from "./call-log";

type RouteHandler = (request: Request) => Promise<unknown>;

type RouteTable = {
  prefix?: string;
  get?: Record<string, RouteHandler>;
  post?: Record<string, RouteHandler>;
  put?: Record<string, RouteHandler>;
  patch?: Record<string, RouteHandler>;
  delete?: Record<string, RouteHandler>;
};

function buildCtx(event: H3Event) {
  const url = getRequestURL(event);
  const method = event.method;
  const headers = getRequestHeaders(event);
  return {
    request: {
      method,
      url: url.pathname + url.search,
      path: url.pathname,
      type: headers["content-type"] || "",
      headers,
      search: url.search,
      body: (event.context as { legacyBody?: unknown }).legacyBody ?? {},
      files: (event.context as { legacyFiles?: unknown }).legacyFiles ?? {},
    },
    query: getQuery(event),
    params: (event.context as { legacyParams?: Record<string, string> }).legacyParams ?? {},
    ip: getRequestIP(event, { xForwardedFor: true }),
    status: 200,
    type: "application/json",
    set: (h: Record<string, string>) => {
      for (const [k, v] of Object.entries(h)) setResponseHeader(event, k, String(v));
    },
    redirect: (target: string) => {
      (event.context as { legacyRedirect?: string }).legacyRedirect = target;
    },
    body: undefined as unknown,
  };
}

function findHandler(
  tables: RouteTable[],
  method: string,
  pathname: string,
): { handler: RouteHandler; params: Record<string, string> } | null {
  const m = method.toLowerCase();
  for (const table of tables) {
    const prefix = table.prefix || "";
    const bucket = table[m as keyof RouteTable];
    if (!bucket || typeof bucket !== "object") continue;
    for (const [pattern, handler] of Object.entries(bucket)) {
      const full = `${prefix}${pattern}`;
      const paramNames: string[] = [];
      const re = new RegExp(
        `^${full.replace(/:[^/]+/g, (seg) => {
          paramNames.push(seg.slice(1));
          return "([^/]+)";
        })}$`,
      );
      const match = pathname.match(re);
      if (match && typeof handler === "function") {
        const params: Record<string, string> = {};
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1] ?? "";
        });
        return { handler, params };
      }
    }
  }
  return null;
}

function serializeBody(body: unknown): unknown {
  if (Body.isInstance(body)) return body.toObject();
  return body;
}

function isReadableStream(body: unknown): body is NodeJS.ReadableStream {
  return !!body && typeof body === "object" && typeof (body as { pipe?: unknown }).pipe === "function";
}

function setResponseHeaders(event: H3Event, headers?: Record<string, unknown>) {
  if (!headers) return;
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    setResponseHeader(event, key, Array.isArray(value) ? value.map(String) : String(value));
  }
}

async function sendPayload(event: H3Event, payload: unknown) {
  if (payload === undefined) {
    await send(event, "");
    return;
  }
  if (isReadableStream(payload)) {
    await sendStream(event, payload);
    return;
  }
  if (typeof payload === "string" || payload instanceof Uint8Array) {
    await send(event, payload);
    return;
  }
  if (payload instanceof ArrayBuffer) {
    await send(event, Buffer.from(payload));
    return;
  }
  await send(event, JSON.stringify(payload), "application/json");
}

export async function dispatchLegacyApi(event: H3Event): Promise<boolean> {
  const url = getRequestURL(event);
  const pathname = url.pathname;

  if (pathname.startsWith("/api/admin") || pathname.startsWith("/admin")) {
    return false;
  }

  const found = findHandler(routes as RouteTable[], event.method, pathname);
  if (!found) return false;

  const started = Date.now();
  const ctx = buildCtx(event);
  ctx.params = found.params;
  const request = new Request(ctx);

  try {
    let result = await found.handler(request);
    if (!Response.isInstance(result)) {
      result = new Response(result);
    }
    const res = result as InstanceType<typeof Response>;
    const redirect = (event.context as { legacyRedirect?: string }).legacyRedirect;
    if (redirect) {
      await sendRedirect(event, redirect, res.statusCode || 302);
      logApiCall({
        path: pathname,
        method: event.method,
        statusCode: res.statusCode || 302,
        durationMs: Date.now() - started,
        clientIp: request.remoteIP || undefined,
      });
      return true;
    }
    if (res.statusCode) setResponseStatus(event, res.statusCode);
    setResponseHeaders(event, res.headers);
    if (res.type) setResponseHeader(event, "content-type", res.type);
    const payload = serializeBody(res.body);
    logApiCall({
      path: pathname,
      method: event.method,
      statusCode: res.statusCode || 200,
      durationMs: Date.now() - started,
      clientIp: request.remoteIP || undefined,
    });
    await sendPayload(event, payload);
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const failure = new Response(new FailureBody(err instanceof Error ? err : new Error(message)));
    logApiCall({
      path: pathname,
      method: event.method,
      statusCode: failure.statusCode || 500,
      durationMs: Date.now() - started,
      error: message,
      clientIp: request.remoteIP || undefined,
    });
    setResponseStatus(event, failure.statusCode || 500);
    await sendPayload(event, serializeBody(failure.body));
    return true;
  }
}
