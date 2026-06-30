import { createImageComposition } from "~~/server/services/images";
import { readJsonBody, requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return createImageComposition(await readJsonBody(event), requireAuthorization(event));
});
