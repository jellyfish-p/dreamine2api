import { assertAdmin } from "../../utils/admin-auth";
import { listAccounts, toPublicAccount } from "@legacy/lib/pool/accounts.ts";

export default defineEventHandler((event) => {
  assertAdmin(event);
  return { data: listAccounts().map(toPublicAccount) };
});