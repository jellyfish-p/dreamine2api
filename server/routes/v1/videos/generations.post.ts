import { createVideoGeneration } from "~~/server/services/videos";
import { readJsonBody, requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return createVideoGeneration(await readJsonBody(event), requireAuthorization(event));
});
