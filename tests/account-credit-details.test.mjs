import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

test("account schema and public response include credit breakdown cache fields", () => {
  const schema = read("server/repositories/sqlite/schema.ts");
  const accounts = read("server/services/pool/accounts.ts");

  for (const field of ["last_vip_credit", "last_purchase_credit"]) {
    assert.ok(schema.includes(`${field} INTEGER`), `schema should create ${field}`);
    assert.ok(schema.includes(`column: "${field}"`), `migration should include ${field}`);
    assert.ok(schema.includes(`${field}: number | null`), `PoolAccountRow should type ${field}`);
    assert.ok(accounts.includes(`${field} = ?`), `refreshAccountCredit should persist ${field}`);
    assert.ok(accounts.includes(`${field}: row.${field}`), `toPublicAccount should expose ${field}`);
  }

  assert.ok(
    accounts.includes("points.vipCredit") && accounts.includes("points.purchaseCredit"),
    "refreshAccountCredit should persist vip and purchase credit values from getCredit",
  );
});
