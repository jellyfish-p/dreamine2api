import { checkTokenLive } from "~~/server/services/tokens";
import { readJsonBody } from "~~/server/utils/http/request";

export default defineEventHandler(async (event) => {
  return checkTokenLive(await readJsonBody(event));
});
