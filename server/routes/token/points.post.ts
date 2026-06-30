import { getTokenPoints } from "~~/server/services/tokens";
import { requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler((event) => {
  return getTokenPoints(requireAuthorization(event));
});
