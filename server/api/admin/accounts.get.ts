import { assertAdmin } from "../../utils/admin-auth";
import { listAccounts, toPublicAccount } from "~~/server/services/pool/accounts";

export default defineEventHandler((event) => {
  assertAdmin(event);
  return { data: listAccounts().map(toPublicAccount) };
});