import { getPoolSettingsResponse } from "~~/server/services/pool/admin-actions";
import { requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler((event) => {
  return getPoolSettingsResponse(requireAuthorization(event));
});
