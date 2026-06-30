import { readBody } from "h3";
import { dispatchLegacyApi } from "../utils/legacy-dispatch";

const LEGACY_PREFIXES = ["/v1", "/pool"];

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (path === "/" && event.method === "GET") {
    return;
  }
  if (!LEGACY_PREFIXES.some((p) => path.startsWith(p))) {
    return;
  }

  if (["POST", "PUT", "PATCH"].includes(event.method)) {
    try {
      const body = await readBody(event);
      (event.context as { legacyBody?: unknown }).legacyBody = body ?? {};
    } catch {
      (event.context as { legacyBody?: unknown }).legacyBody = {};
    }
  }

  const handled = await dispatchLegacyApi(event);
  if (handled) {
    return;
  }
});