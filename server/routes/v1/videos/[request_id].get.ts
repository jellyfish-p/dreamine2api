import { getRouterParam } from "h3";
import { getVideoGenerationStatus } from "~~/server/services/videos";

export default defineEventHandler((event) => {
  return getVideoGenerationStatus(getRouterParam(event, "request_id") || "");
});
