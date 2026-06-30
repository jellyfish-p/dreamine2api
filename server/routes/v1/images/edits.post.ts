import { createImageEdit } from "~~/server/services/images";
import { readJsonBody, requireAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return createImageEdit(await readJsonBody(event), requireAuthorization(event));
});
