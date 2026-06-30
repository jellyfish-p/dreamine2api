import { assertAdmin } from "../../utils/admin-auth";
import { countApiCalls, listApiCalls, apiCallStats } from "../../utils/call-log";

export default defineEventHandler((event) => {
  assertAdmin(event);
  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 50, 200);
  const offset = Number(query.offset) || 0;
  const sinceHours = Number(query.since_hours) || 24;
  const sinceTs = Math.floor(Date.now() / 1000) - sinceHours * 3600;
  return {
    total: countApiCalls(),
    stats: apiCallStats(sinceTs),
    data: listApiCalls(limit, offset),
  };
});