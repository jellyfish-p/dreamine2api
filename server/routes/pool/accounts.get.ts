import { getPoolAccountsResponse } from "~~/server/services/pool/admin-actions";
import { requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler((event) => {
  return getPoolAccountsResponse(requireAuthorization(event));
});
