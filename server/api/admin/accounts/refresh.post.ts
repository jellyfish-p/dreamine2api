import { assertAdmin } from "../../../utils/admin-auth";
import { refreshAccountCredit, refreshAllCredits } from "~~/server/services/pool/accounts";

export default defineEventHandler(async (event) => {
  assertAdmin(event);
  const body = await readBody<{ id?: number }>(event);
  if (body?.id !== undefined) {
    return refreshAccountCredit(Number(body.id));
  }
  return { results: await refreshAllCredits() };
});