import { updatePoolSettings } from "~~/server/services/pool/admin-actions";
import { readJsonBody, requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return updatePoolSettings(await readJsonBody(event), requireAuthorization(event));
});
