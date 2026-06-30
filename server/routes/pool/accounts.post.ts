import { createPoolAccount } from "~~/server/services/pool/admin-actions";
import { readJsonBody, requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return createPoolAccount(await readJsonBody(event), requireAuthorization(event));
});
