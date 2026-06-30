import { getImageHistory } from "~~/server/services/images";
import { readJsonBody, requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return getImageHistory(await readJsonBody(event), requireAuthorization(event));
});
