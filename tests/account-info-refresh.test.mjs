import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

test("account type refresh uses commerce user_info before optional passport lookup", () => {
  const source = fs.readFileSync(
    path.join(projectRoot, "server/services/pool/accounts.ts"),
    "utf8",
  );
  const match = source.match(
    /export async function fetchAccountInfo\(id: number\) \{([\s\S]+?)\n\}/,
  );
  assert.ok(match, "fetchAccountInfo should exist");

  const body = match[1];
  const commerceIndex = body.indexOf("getCommerceAccountInfo(");
  const passportIndex = body.indexOf("getAccountInfo(");

  assert.notEqual(commerceIndex, -1, "fetchAccountInfo should call commerce user_info");
  assert.notEqual(passportIndex, -1, "fetchAccountInfo may still call passport as fallback");
  assert.ok(
    commerceIndex < passportIndex,
    "commerce user_info should be the primary account API before passport fallback",
  );
});
