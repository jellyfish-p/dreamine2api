import { listModels } from "~~/server/services/models";
import { getAuthorization } from "~~/server/utils/http/request";

export default defineEventHandler((event) => {
  return listModels(getAuthorization(event));
});
